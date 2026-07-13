import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import * as xlsx from 'xlsx';
import { formatDate } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const kaders = await prisma.kader.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Format data untuk dimasukkan ke Excel
    const excelData = kaders.map(kader => ({
      'Nama Lengkap': kader.namaLengkap,
      'NIA / KTA': kader.nia || '-',
      'Jenis Kelamin': kader.jenisKelamin === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan',
      'Tempat Lahir': kader.tempatLahir || '-',
      'Tanggal Lahir': kader.tanggalLahir ? formatDate(kader.tanggalLahir) : '-',
      'No. HP': kader.noTelepon || '-',
      'Alamat': kader.alamat || '-',
      'Kampus': kader.asalKampus || '-',
      'Fakultas': kader.fakultas || '-',
      'Jurusan': kader.jurusan || '-',
      'Tahun Masuk': kader.tahunMasuk || '-',
      'Komisariat': kader.komisariat || '-',
      'Rayon': kader.rayon || '-',
      'Status MAPABA': kader.statusMapaba ? 'Lulus' : 'Belum',
      'Status PKD': kader.statusPKD ? 'Lulus' : 'Belum',
      'Status PKL': kader.statusPKL ? 'Lulus' : 'Belum',
    }));

    const worksheet = xlsx.utils.json_to_sheet(excelData);
    
    // Auto-adjust lebar kolom agar tulisan tidak terpotong
    const colWidths = [
      { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, 
      { wch: 15 }, { wch: 30 }, { wch: 20 }, { wch: 20 }, { wch: 20 },
      { wch: 15 }, { wch: 25 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
    ];
    worksheet['!cols'] = colWidths;

    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Data Kader');

    const excelBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    const headers = new Headers();
    headers.append('Content-Disposition', 'attachment; filename="data-kader-pmii.xlsx"');
    headers.append('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    return new NextResponse(excelBuffer, { headers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
