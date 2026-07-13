import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const { searchParams } = new URL(request.url);
    const jenis = searchParams.get('jenis');
    
    const whereClause: any = {};
    if (jenis) whereClause.jenis = jenis;

    const surat = await prisma.surat.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(surat);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const data = await request.json();
    const surat = await prisma.surat.create({
      data: {
        nomorSurat: data.nomorSurat,
        jenis: data.jenis,
        kategori: data.kategori,
        perihal: data.perihal,
        pengirim: data.pengirim,
        tujuan: data.tujuan,
        tanggal: new Date(data.tanggal),
        fileUrl: data.fileUrl,
        keterangan: data.keterangan
      }
    });
    
    return NextResponse.json(surat, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal membuat arsip surat' }, { status: 500 });
  }
}
