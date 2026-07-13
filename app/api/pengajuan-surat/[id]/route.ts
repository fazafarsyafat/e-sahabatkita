import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const data = await request.json();
    
    const currentSurat = await prisma.pengajuanSurat.findUnique({ where: { id: params.id } });
    
    const updated = await prisma.pengajuanSurat.update({
      where: { id: params.id },
      data: {
        status: data.status,
        catatanAdmin: data.catatanAdmin,
        fileBalasanUrl: data.fileBalasanUrl,
      }
    });
    
    // Jika disetujui, lempar otomatis menjadi Arsip Surat Keluar
    if (data.status === 'DITERIMA' && currentSurat?.status !== 'DITERIMA' && data.fileBalasanUrl) {
       await prisma.surat.create({
         data: {
           nomorSurat: `REQ-${updated.nomorResi}`,
           jenis: 'KELUAR',
           kategori: updated.jenisSurat,
           perihal: updated.perihal,
           tujuan: updated.tujuanSurat || updated.namaPemohon,
           tanggal: new Date(),
           fileUrl: data.fileBalasanUrl,
           keterangan: `Diterbitkan secara otomatis untuk pemohon: ${updated.namaPemohon} (${updated.asalStruktur}) dengan Nomor Resi: ${updated.nomorResi}`
         }
       });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengupdate pengajuan' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    await prisma.pengajuanSurat.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ message: 'Berhasil dihapus' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal menghapus' }, { status: 500 });
  }
}
