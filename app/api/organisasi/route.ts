import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const komisariatList = await prisma.komisariat.findMany({
      include: {
        rayon: true
      },
      orderBy: {
        nama: 'asc'
      }
    });

    return NextResponse.json({ data: komisariatList });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
