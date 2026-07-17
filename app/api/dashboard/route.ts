import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getScopeFilter } from '@/lib/scope';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const scopeFilter = getScopeFilter(session);

    // Hitung total kader
    const totalKader = await prisma.kader.count({ where: scopeFilter });

    // Hitung organisasi
    const totalKomisariat = await prisma.komisariat.count();
    const totalRayon = await prisma.rayon.count();

    // Surat
    const totalSuratMasuk = await prisma.surat.count({ where: { ...scopeFilter, jenis: 'MASUK' } });
    const totalSuratKeluar = await prisma.surat.count({ where: { ...scopeFilter, jenis: 'KELUAR' } });

    // Arsip (Total surat)
    const totalArsip = await prisma.surat.count({ where: scopeFilter });

    // Arsip tahun ini
    const tahunIni = new Date().getFullYear();
    const totalArsipTahunIni = await prisma.surat.count({
      where: {
        ...scopeFilter,
        createdAt: {
          gte: new Date(`${tahunIni}-01-01T00:00:00.000Z`)
        }
      }
    });

    // Pengajuan Surat (Menunggu proses)
    const pengajuanSurat = await prisma.pengajuanSurat.count({ where: { ...scopeFilter, status: 'PENDING' } });

    // Tinjauan Surat Terbaru (Untuk Super Admin / Admin Cabang)
    const recentPengajuan = await prisma.pengajuanSurat.findMany({
      where: { ...scopeFilter, status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    return NextResponse.json({
      stats: {
        totalKader,
        komisariat: totalKomisariat,
        rayon: totalRayon,
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
