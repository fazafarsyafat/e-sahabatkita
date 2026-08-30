import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      name, email, password, noTelepon, 
      tempatLahir, tanggalLahir, jenisKelamin, alamat,
      asalKampus, fakultas, jurusan, tahunMasuk,
      komisariatId, rayonId 
    } = data;

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Nama, Email, dan Password wajib diisi.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email sudah terdaftar. Silakan gunakan email lain.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ANGGOTA',
        statusApproval: 'PENDING',
        komisariatId: komisariatId || null,
        rayonId: rayonId || null,
        kader: {
          create: {
            namaLengkap: name,
            noTelepon: noTelepon || null,
            tempatLahir: tempatLahir || null,
            tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : null,
            jenisKelamin: jenisKelamin || 'LAKI_LAKI',
            alamat: alamat || null,
            asalKampus: asalKampus || null,
            fakultas: fakultas || null,
            jurusan: jurusan || null,
            tahunMasuk: tahunMasuk ? parseInt(tahunMasuk) : null,
            komisariatId: komisariatId || null,
            rayonId: rayonId || null,
          }
        }
      }
    });

    return NextResponse.json({ success: true, message: 'Pendaftaran berhasil. Silakan tunggu verifikasi admin.' });
  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat mendaftar.' }, { status: 500 });
  }
}
