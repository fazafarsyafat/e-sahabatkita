import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// 1. Fungsi Mengambil Daftar Agenda
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const upcomingOnly = searchParams.get('upcoming') === 'true';

    const whereClause: any = {};
    if (upcomingOnly) {
      // Jika hanya minta acara mendatang, pastikan waktunya lebih besar dari hari ini
      whereClause.waktuPelaksanaan = {
        gte: new Date(new Date().setHours(0, 0, 0, 0)) // Mulai dari hari ini
      };
      whereClause.status = 'Mendatang';
    }

    const agenda = await prisma.agenda.findMany({
      where: whereClause,
      // Urutkan jadwal yang paling dekat terlebih dahulu jika mendatang, 
      // Tapi jika semua agenda (riwayat), kita urutkan yang terbaru (descending)
      orderBy: { waktuPelaksanaan: upcomingOnly ? 'asc' : 'desc' }, 
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(agenda);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. Fungsi Menambah Agenda Baru
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Anda harus login untuk menambah jadwal' }, { status: 401 });
    }

    const data = await request.json();
    
    if (!data.judul || !data.kategori || !data.lokasi || !data.waktuPelaksanaan) {
      return NextResponse.json({ error: 'Data penting seperti Judul, Kategori, Lokasi, dan Tanggal tidak boleh kosong' }, { status: 400 });
    }

    const newAgenda = await prisma.agenda.create({
      data: {
        judul: data.judul,
        kategori: data.kategori,
        lokasi: data.lokasi,
        waktuPelaksanaan: new Date(data.waktuPelaksanaan),
        status: data.status || 'Mendatang',
        deskripsi: data.deskripsi || null,
      }
    });

    return NextResponse.json(newAgenda, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
