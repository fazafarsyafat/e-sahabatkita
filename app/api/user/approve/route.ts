import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    
    if (!session || role === 'USER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, action } = await request.json(); // action = 'APPROVE' or 'REJECT'

    if (action === 'APPROVE') {
      await prisma.user.update({
        where: { id: userId },
        data: { statusApproval: 'APPROVED' }
      });
      return NextResponse.json({ success: true, message: 'Kader berhasil disetujui dan kini aktif.' });
    } else if (action === 'REJECT') {
      await prisma.user.update({
        where: { id: userId },
        data: { statusApproval: 'REJECTED' }
      });
      return NextResponse.json({ success: true, message: 'Pendaftaran kader telah ditolak.' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
