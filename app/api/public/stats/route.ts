import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const totalKader = await prisma.kader.count();
    
    // Hitung total komisariat & rayon
    const totalKomisariat = await prisma.komisariat.count();
    const totalRayon = await prisma.rayon.count();
    
    // Surat & Arsip
    const totalSuratKeluar = await prisma.surat.count({ where: { jenis: 'KELUAR' } });
    const totalArsip = await prisma.surat.count();
    
    return NextResponse.json({
      totalKader,
      totalKomisariat,
      totalRayon,
      suratKeluar: totalSuratKeluar,
      arsipAktif: totalArsip,
    });
  } catch (error) {
    console.error('Error fetching public stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
