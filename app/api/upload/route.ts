import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Anda harus login untuk mengunggah gambar' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file gambar yang dikirim' }, { status: 400 });
    }

    // Mengubah file menjadi bentuk data yang bisa disimpan komputer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Membuat nama file yang aman (menghapus spasi dan menambahkan penanda waktu agar tidak bentrok)
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
    // Memastikan folder "public/uploads" sudah ada di proyek ini
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Abaikan jika folder sudah ada
    }

    // Menyimpan file secara fisik ke dalam komputer/server
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // Mengembalikan rute (URL) gambar yang bisa langsung diakses oleh masyarakat
    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({ url: fileUrl });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Gagal mengunggah gambar. Pastikan format gambar benar.' }, { status: 500 });
  }
}
