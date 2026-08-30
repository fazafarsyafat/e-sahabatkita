import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;
    if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN_CABANG')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { nama, jabatan, divisi, urutan, periode } = data;

    const pengurus = await prisma.strukturPengurus.update({
      where: { id: params.id },
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
    return NextResponse.json({ error: 'Failed to update pengurus' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;
    if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN_CABANG')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.strukturPengurus.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete pengurus' }, { status: 500 });
  }
}
