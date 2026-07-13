import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Hanya Super Admin yang berhak' }, { status: 401 });
    }

    const { kaderId } = await request.json();

    const kader = await prisma.kader.findUnique({ where: { id: kaderId } });
    if (!kader) return NextResponse.json({ error: 'Kader tidak ditemukan' }, { status: 404 });
    if (kader.userId) return NextResponse.json({ error: 'Kader ini sudah memiliki akun' }, { status: 400 });

    const hashedPassword = await bcrypt.hash('PMII2026', 10);

    // Ambil kata pertama dari nama lengkap
    const firstName = kader.namaLengkap.trim().split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    let finalEmail = `${firstName}@pmii.or.id`;

    // Pastikan email tidak duplikat
    let existing = await prisma.user.findUnique({ where: { email: finalEmail } });
    let counter = 1;
    while (existing) {
       finalEmail = `${firstName}${counter}@pmii.or.id`;
       existing = await prisma.user.findUnique({ where: { email: finalEmail } });
       counter++;
    }

    const newUser = await prisma.user.create({
      data: {
        name: kader.namaLengkap,
        email: finalEmail,
        password: hashedPassword,
        role: 'USER',
        statusApproval: 'APPROVED'
      }
    });

    await prisma.kader.update({
      where: { id: kaderId },
      data: { userId: newUser.id }
    });

    return NextResponse.json({ success: true, message: `Akun dibuat! Email: ${finalEmail} (Pass: PMII2026)` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
