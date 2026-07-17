import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getScopeFilter } from '@/lib/scope';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    let where: any = getScopeFilter(session);
    const role = (session.user as any).role;
    // Jika ANGGOTA biasa, hanya bisa melihat pengajuannya sendiri
    if (role === 'ANGGOTA') {
      where.userId = (session.user as any).id;
    }

    const surat = await prisma.pengajuanSurat.findMany({ where, orderBy: { createdAt: 'desc' } });
    return NextResponse.json(surat);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const data = await request.json();
    const nomorResi = 'SRT-' + Date.now().toString().slice(-6) + '-' + Math.floor(Math.random() * 1000);
    
    const surat = await prisma.pengajuanSurat.create({
      data: {
        nomorResi,
        userId: (session.user as any).id,
        namaPemohon: data.namaPemohon,
        asalStruktur: data.asalStruktur,
        jenisSurat: data.jenisSurat,
        perihal: data.perihal,
        keterangan: data.keterangan,
        tujuanScope: data.tujuanScope || 'PC',
        tujuanId: data.tujuanId || null,
        komisariatId: (session.user as any).komisariatId || null,
        rayonId: (session.user as any).rayonId || null
      }
    });
    return NextResponse.json(surat, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal membuat pengajuan' }, { status: 500 });
  }
}
