import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jenjang = searchParams.get('jenjang');

    const materi = await prisma.materiKaderisasi.findMany({
      where: jenjang ? { jenjang } : undefined,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(materi);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['SUPER_ADMIN', 'ADMIN_CABANG', 'ADMIN_KOMISARIAT', 'ADMIN_RAYON'].includes((session.user as any).role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { judul, jenjang, fileUrl, ukuran, format } = body;

    if (!judul || !jenjang || !fileUrl) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    const newMateri = await prisma.materiKaderisasi.create({
      data: {
        judul,
        jenjang,
        fileUrl,
        ukuran: ukuran || '1 MB',
        format: format || 'PDF',
      }
    });

    return NextResponse.json(newMateri);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
