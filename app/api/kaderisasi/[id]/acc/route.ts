import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role === 'ANGGOTA') {
      return NextResponse.json({ error: 'Hanya Admin yang berhak' }, { status: 403 });
    }

    const data = await request.json(); // { pesertaId: "...", status: "LULUS_SCREENING" }
    const { pesertaId, status } = data;

    const updated = await prisma.pesertaKaderisasi.update({
      where: { id: pesertaId },
      data: { statusScreening: status }
    });

    return NextResponse.json({ success: true, message: `Status screening diperbarui menjadi ${status}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
