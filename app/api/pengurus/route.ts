import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const pengurus = await prisma.strukturPengurus.findMany({
      orderBy: [
        { urutan: 'asc' },
        { createdAt: 'desc' }
      ]
    });
    return NextResponse.json(pengurus);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pengurus' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ADMIN_CABANG')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { nama, jabatan, divisi, urutan, periode } = data;

    if (!nama || !jabatan || !divisi) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const pengurus = await prisma.strukturPengurus.create({
      data: {
        nama,
        jabatan,
        divisi,
        urutan: parseInt(urutan) || 0,
        periode: periode || ''
      }
    });

    return NextResponse.json(pengurus);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create pengurus' }, { status: 500 });
  }
}
