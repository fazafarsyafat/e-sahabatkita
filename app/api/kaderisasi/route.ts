import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const programs = await prisma.programKaderisasi.findMany({
      include: {
        komisariat: { select: { nama: true } },
        peserta: {
          include: {
            user: { select: { name: true, email: true, kader: { select: { nia: true, asalKampus: true } } } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(programs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role === 'ANGGOTA') {
      return NextResponse.json({ error: 'Hanya Admin yang berhak' }, { status: 403 });
    }

    const data = await request.json();
    if (!data.jenis || !data.angkatan || !data.lokasi) {
      return NextResponse.json({ error: 'Jenis, Angkatan, dan Lokasi wajib diisi' }, { status: 400 });
    }

    let komisariatId = null;
    if (data.komisariat) {
      const existing = await prisma.komisariat.findFirst({
        where: { nama: { contains: data.komisariat, mode: 'insensitive' } }
      });
      if (existing) {
        komisariatId = existing.id;
      }
    }

    const newProgram = await prisma.programKaderisasi.create({
      data: {
        jenis: data.jenis,
        angkatan: data.angkatan,
        tanggalMulai: new Date(data.tanggalMulai || new Date()),
        tanggalSelesai: new Date(data.tanggalSelesai || new Date()),
        lokasi: data.lokasi,
        komisariatId: komisariatId,
        deskripsi: data.deskripsi || null,
        status: 'OPEN'
      }
    });

    return NextResponse.json(newProgram, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
