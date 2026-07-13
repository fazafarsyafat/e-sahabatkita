import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const totalKader = await prisma.kader.count();
    
    // Hitung unik komisariat & rayon dari tabel kader
    const kaders = await prisma.kader.findMany({ select: { komisariat: true, rayon: true } });
    const setKomisariat = new Set(kaders.map(k => k.komisariat).filter(k => k && k.trim() !== ''));
    const setRayon = new Set(kaders.map(k => k.rayon).filter(r => r && r.trim() !== ''));
    
    // Surat & Arsip
    const totalSuratKeluar = await prisma.surat.count({ where: { jenis: 'KELUAR' } });
    const totalArsip = await prisma.surat.count();
    
    return NextResponse.json({
      totalKader,
      totalKomisariat: setKomisariat.size,
      totalRayon: setRayon.size,
      suratKeluar: totalSuratKeluar,
      arsipAktif: totalArsip,
    });
  } catch (error) {
    console.error('Error fetching public stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
