import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const data = await request.json();
    
    // Mengecek status sebelum update untuk menghindari duplikasi Arsip
    const currentSk = await prisma.pengajuanSK.findUnique({ where: { id: params.id } });
    
    const updated = await prisma.pengajuanSK.update({
      where: { id: params.id },
      data: {
        status: data.status,
        catatanAdmin: data.catatanAdmin,
        fileBalasanUrl: data.fileBalasanUrl,
      }
    });
    
    // Jika status diubah menjadi DITERIMA, dan sebelumnya bukan DITERIMA, 
    // otomatis buat salinan di Arsip Surat Keluar.
    if (data.status === 'DITERIMA' && currentSk?.status !== 'DITERIMA' && data.fileBalasanUrl) {
       await prisma.surat.create({
         data: {
           nomorSurat: `SK-${updated.nomorResi}`,
           jenis: 'KELUAR',
           kategori: 'SK',
           perihal: `Penerbitan SK ${updated.namaStruktur} Periode ${updated.periode}`,
           tujuan: updated.namaStruktur,
           tanggal: new Date(),
           fileUrl: data.fileBalasanUrl,
           keterangan: `Penerbitan SK Otomatis dari sistem E-Sahabat dengan Nomor Resi: ${updated.nomorResi}. Ketua Terpilih: ${updated.ketuaTerpilih}`
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
    
    await prisma.pengajuanSK.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ message: 'Berhasil dihapus' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal menghapus' }, { status: 500 });
  }
}
