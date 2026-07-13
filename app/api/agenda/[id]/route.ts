import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// 3. Fungsi Mengubah (Edit) Agenda
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Anda harus login untuk mengubah jadwal' }, { status: 401 });
    }

    const id = params.id;
    const data = await request.json();

    const updatedAgenda = await prisma.agenda.update({
      where: { id },
      data: {
        judul: data.judul,
        kategori: data.kategori,
        lokasi: data.lokasi,
        waktuPelaksanaan: data.waktuPelaksanaan ? new Date(data.waktuPelaksanaan) : undefined,
        status: data.status,
        deskripsi: data.deskripsi,
      }
    });

    return NextResponse.json(updatedAgenda);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 4. Fungsi Menghapus Agenda
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Anda harus login untuk menghapus jadwal' }, { status: 401 });
    }

    const id = params.id;
    await prisma.agenda.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
