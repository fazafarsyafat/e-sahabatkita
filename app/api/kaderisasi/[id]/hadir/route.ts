import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Silakan login terlebih dahulu' }, { status: 401 });

    const data = await request.json();
    const { kodePresensi } = data;
    const programId = params.id;
    const userId = (session.user as any).id;

    // 1. Cek program dan kodenya
    const program = await prisma.programKaderisasi.findUnique({ where: { id: programId } });
    if (!program) return NextResponse.json({ error: 'Program tidak ditemukan' }, { status: 404 });
    
    // Periksa apakah program sedang berlangsung (hanya ONGOING yang boleh absen, tapi bisa dibuat fleksibel)
    if (program.status === 'COMPLETED') return NextResponse.json({ error: 'Kegiatan ini sudah selesai' }, { status: 400 });
    
    if (program.kodePresensi !== kodePresensi) {
      return NextResponse.json({ error: 'Kode Presensi SALAH atau tidak valid' }, { status: 400 });
    }

    // 2. Cek apakah user adalah peserta yang lulus screening
    const pendaftaran = await prisma.pesertaKaderisasi.findUnique({
      where: { programId_userId: { programId, userId } }
    });

    if (!pendaftaran) return NextResponse.json({ error: 'Anda belum terdaftar di program ini' }, { status: 400 });
    if (pendaftaran.statusScreening !== 'LULUS_SCREENING') {
      return NextResponse.json({ error: 'Pendaftaran Anda belum di-ACC (Screening)' }, { status: 403 });
    }
    if (pendaftaran.waktuPresensi) {
      return NextResponse.json({ error: 'Anda sudah melakukan presensi sebelumnya' }, { status: 400 });
    }

    // 3. Catat presensi
    await prisma.pesertaKaderisasi.update({
      where: { id: pendaftaran.id },
      data: { waktuPresensi: new Date() }
    });

    return NextResponse.json({ success: true, message: 'Presensi berhasil dicatat!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
