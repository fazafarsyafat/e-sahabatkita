import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Fungsi kecil untuk membuat Tautan URL bersih (Slug) dari Judul Berita
function createSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// MENGAMBIL DAFTAR BERITA
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get('published') === 'true';
    const limit = searchParams.get('limit');
    
    // Jika meminta berita rahasia (Draft), pastikan user sudah login
    if (!publishedOnly) {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: 'Sesi Anda telah berakhir, silakan login kembali' }, { status: 401 });
      }
    }

    const whereClause: any = {};
    if (publishedOnly) {
      whereClause.isPublished = true;
    }

    const berita = await prisma.berita.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
      include: {
        author: {
          select: { name: true, image: true }
        }
      }
    });

    return NextResponse.json(berita);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// MEMBUAT BERITA BARU
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Anda tidak memiliki akses (Unauthorized)' }, { status: 401 });
    }

    const data = await request.json();
    if (!data.judul || !data.konten) {
      return NextResponse.json({ error: 'Judul dan konten berita wajib diisi' }, { status: 400 });
    }

    // Pembuatan Slug Unik agar tidak bentrok jika ada judul yang sama
    let baseSlug = createSlug(data.judul);
    let slug = baseSlug;
    let count = 1;
    while (await prisma.berita.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }
    
    // Jika ringkasan kosong, kita ekstrak teks murni 150 huruf pertama dari konten HTML
    const fallbackRingkasan = data.konten.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...';

    const newBerita = await prisma.berita.create({
      data: {
        judul: data.judul,
        slug: slug,
        ringkasan: data.ringkasan || fallbackRingkasan,
        konten: data.konten,
        kategori: data.kategori || 'Umum',
        gambarSampul: data.gambarSampul || null,
        isPublished: data.isPublished !== undefined ? data.isPublished : true,
        authorId: (session.user as any).id, // Tarik langsung ID penulis dari sesi login
      }
    });

    return NextResponse.json(newBerita, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
