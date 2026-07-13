import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    
    // Fitur pencarian lanjutan (opsional)
    const statusFilter = searchParams.get('status'); // aktif, alumni
    const jenjangFilter = searchParams.get('jenjang');
    const komisariatFilter = searchParams.get('komisariat');

    const kaders = await prisma.kader.findMany({
      where: {
        OR: [
          { namaLengkap: { contains: search, mode: 'insensitive' } },
          { nia: { contains: search, mode: 'insensitive' } },
        ],
        // Kita bisa tambahkan filter jenjang/komisariat di sini nanti jika perlu
      },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(kaders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    if (!data.namaLengkap || !data.jenisKelamin) {
      return NextResponse.json({ error: 'Nama Lengkap dan Jenis Kelamin wajib diisi' }, { status: 400 });
    }

    let parsedTanggalLahir = null;
    if (data.tanggalLahir) {
      const d = new Date(data.tanggalLahir);
      if (!isNaN(d.getTime()) && d.getFullYear() >= 1900 && d.getFullYear() <= 9999) {
        parsedTanggalLahir = d;
      } else {
        return NextResponse.json({ error: 'Format Tanggal Lahir tidak valid (Periksa penulisan tahun)' }, { status: 400 });
      }
    }

    let newUserId = null;

    // Jika admin mengisi email, buatkan akun user sekalian!
    if (data.email) {
      const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
      if (existingUser) {
        return NextResponse.json({ error: 'Email sudah terdaftar. Silakan gunakan email lain.' }, { status: 400 });
      }
      
      const hashedPassword = await bcrypt.hash('PMII2026', 10);
      const newUser = await prisma.user.create({
        data: {
          name: data.namaLengkap,
          email: data.email,
          password: hashedPassword,
          role: 'USER',
          statusApproval: 'APPROVED'
        }
      });
      newUserId = newUser.id;
    }

    const newKader = await prisma.kader.create({
      data: {
        userId: newUserId,
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
        statusMapaba: data.statusMapaba || false,
        statusPKD: data.statusPKD || false,
        statusPKL: data.statusPKL || false,
      }
    });

    return NextResponse.json(newKader, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Data NIA sudah digunakan oleh kader lain' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
