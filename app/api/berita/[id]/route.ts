import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const berita = await prisma.berita.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: { name: true, image: true }
        }
      }
    });

    if (!berita) {
      return NextResponse.json({ error: 'Berita tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(berita);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;
    const data = await request.json();

    const fallbackRingkasan = data.konten 
      ? data.konten.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'
      : undefined;

    const updatedBerita = await prisma.berita.update({
      where: { id },
      data: {
        judul: data.judul,
        ringkasan: data.ringkasan || fallbackRingkasan,
        konten: data.konten,
        kategori: data.kategori,
        gambarSampul: data.gambarSampul,
        isPublished: data.isPublished,
      }
    });

    return NextResponse.json(updatedBerita);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;
    await prisma.berita.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
