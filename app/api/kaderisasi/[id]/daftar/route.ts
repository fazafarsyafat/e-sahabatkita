import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Silakan login terlebih dahulu' }, { status: 401 });

    const data = await request.json();
    const programId = params.id;
    const userId = (session.user as any).id;

    const program = await prisma.programKaderisasi.findUnique({ where: { id: programId } });
    if (!program) return NextResponse.json({ error: 'Program tidak ditemukan' }, { status: 404 });
    if (program.status !== 'OPEN') return NextResponse.json({ error: 'Pendaftaran program ini sedang ditutup' }, { status: 400 });

    const newPeserta = await prisma.pesertaKaderisasi.create({
      data: {
        programId,
        userId,
        alasanIkut: data.alasanIkut,
        pengalaman: data.pengalaman,
        statusScreening: 'PENDING'
      }
    });

    return NextResponse.json({ success: true, message: 'Berhasil mendaftar, menunggu ACC Admin' }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') return NextResponse.json({ error: 'Anda sudah mendaftar di program ini' }, { status: 400 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
