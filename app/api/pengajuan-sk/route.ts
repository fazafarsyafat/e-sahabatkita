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
    if (role === 'ANGGOTA' || role === 'KETUA_KOMISARIAT' || role === 'SEKRETARIS_KOMISARIAT' || role === 'KETUA_RAYON' || role === 'SEKRETARIS_RAYON') {
      where.userId = (session.user as any).id;
    }

    const sk = await prisma.pengajuanSK.findMany({ where, orderBy: { createdAt: 'desc' } });
    return NextResponse.json(sk);
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
    const nomorResi = 'SK-' + Date.now().toString().slice(-6) + '-' + Math.floor(Math.random() * 1000);
    
    const sk = await prisma.pengajuanSK.create({
      data: {
        nomorResi,
        userId: (session.user as any).id,
        tingkatan: data.tingkatan,
        namaStruktur: data.namaStruktur,
        periode: data.periode,
        ketuaTerpilih: data.ketuaTerpilih,
        asalStruktur: data.asalStruktur,
        fileSyaratUrl: data.fileSyaratUrl,
        komisariatId: (session.user as any).komisariatId || null
      }
    });
    return NextResponse.json(sk, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal membuat pengajuan' }, { status: 500 });
  }
}
