import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const data = await request.json();
    const surat = await prisma.surat.update({
      where: { id: params.id },
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
    
    return NextResponse.json(surat);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengubah surat' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    await prisma.surat.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ message: 'Surat berhasil dihapus' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal menghapus surat' }, { status: 500 });
  }
}
