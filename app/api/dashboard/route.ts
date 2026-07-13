import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Hitung total kader
    const totalKader = await prisma.kader.count();

    // Hitung unik komisariat & rayon dari tabel kader
    const kaders = await prisma.kader.findMany({ select: { komisariat: true, rayon: true } });
    const setKomisariat = new Set(kaders.map(k => k.komisariat).filter(k => k && k.trim() !== ''));
    const setRayon = new Set(kaders.map(k => k.rayon).filter(r => r && r.trim() !== ''));

    // Surat
    const totalSuratMasuk = await prisma.surat.count({ where: { jenis: 'MASUK' } });
    const totalSuratKeluar = await prisma.surat.count({ where: { jenis: 'KELUAR' } });

    // Arsip (Total surat)
    const totalArsip = await prisma.surat.count();

    // Arsip tahun ini
    const tahunIni = new Date().getFullYear();
    const totalArsipTahunIni = await prisma.surat.count({
      where: {
        createdAt: {
          gte: new Date(`${tahunIni}-01-01T00:00:00.000Z`)
        }
      }
    });

    // Pengajuan Surat (Menunggu proses)
    const pengajuanSurat = await prisma.pengajuanSurat.count({ where: { status: 'PENDING' } });

    // Tinjauan Surat Terbaru (Untuk Super Admin / Admin Cabang)
    const recentPengajuan = await prisma.pengajuanSurat.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    return NextResponse.json({
      stats: {
        totalKader,
        komisariat: setKomisariat.size,
        rayon: setRayon.size,
        suratMasuk: totalSuratMasuk,
        suratKeluar: totalSuratKeluar,
        arsip: totalArsip,
        arsipTahunIni: totalArsipTahunIni,
        pengajuanSurat
      },
      recentPengajuan
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
