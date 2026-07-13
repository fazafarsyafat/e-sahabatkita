import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;
    const data = await request.json();

    let parsedTanggalLahir = null;
    if (data.tanggalLahir) {
      const d = new Date(data.tanggalLahir);
      if (!isNaN(d.getTime()) && d.getFullYear() >= 1900 && d.getFullYear() <= 9999) {
        parsedTanggalLahir = d;
      } else {
        return NextResponse.json({ error: 'Format Tanggal Lahir tidak valid (Periksa penulisan tahun)' }, { status: 400 });
      }
    }

    const updatedKader = await prisma.kader.update({
      where: { id },
      data: {
        namaLengkap: data.namaLengkap,
        nia: data.nia || null,
        tempatLahir: data.tempatLahir,
        tanggalLahir: parsedTanggalLahir,
        jenisKelamin: data.jenisKelamin,
        alamat: data.alamat,
        noTelepon: data.noTelepon,
        asalKampus: data.asalKampus,
        fakultas: data.fakultas,
        jurusan: data.jurusan,
        tahunMasuk: data.tahunMasuk ? parseInt(data.tahunMasuk) : null,
        rayon: data.rayon,
        komisariat: data.komisariat,
        statusMapaba: data.statusMapaba,
        statusPKD: data.statusPKD,
        statusPKL: data.statusPKL,
      }
    });

    return NextResponse.json(updatedKader);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;
    await prisma.kader.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
