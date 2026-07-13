import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Hanya Super Admin yang boleh mengganti jabatan!
    if (!session || (session.user as any).role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Hanya Super Admin yang berhak mengubah jabatan kader.' }, { status: 401 });
    }

    const { userId, newRole } = await request.json(); 

    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    });

    return NextResponse.json({ success: true, message: `Jabatan berhasil diperbarui menjadi ${newRole.replace('_', ' ')}.` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
