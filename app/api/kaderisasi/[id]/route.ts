import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role === 'USER') {
      return NextResponse.json({ error: 'Hanya Admin yang berhak' }, { status: 403 });
    }

    const data = await request.json();
    const id = params.id;

    // Bisa update status (OPEN, ONGOING, COMPLETED) atau update kode presensi
    const updated = await prisma.programKaderisasi.update({
      where: { id },
      data: {
        status: data.status,
        kodePresensi: data.kodePresensi,
      }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    if (error.code === 'P2002') return NextResponse.json({ error: 'Kode Presensi ini sudah dipakai di kegiatan lain' }, { status: 400 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role === 'USER') {
      return NextResponse.json({ error: 'Hanya Admin yang berhak' }, { status: 403 });
    }

    await prisma.programKaderisasi.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, message: 'Program berhasil dihapus' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
