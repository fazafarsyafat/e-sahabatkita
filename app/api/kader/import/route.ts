import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import * as xlsx from 'xlsx';
import { getScopeFilter } from '@/lib/scope';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang diunggah' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const scopeFilter = getScopeFilter(session);

    // Fetch master data untuk mapping nama string -> UUID
    const dbKomisariats = await prisma.komisariat.findMany({ include: { rayon: true } });
    const komMap = new Map<string, string>();
    const rayonMap = new Map<string, string>();

    for (const kom of dbKomisariats) {
      komMap.set(kom.nama.trim().toLowerCase(), kom.id);
      for (const ry of kom.rayon) {
        rayonMap.set(ry.nama.trim().toLowerCase(), ry.id);
      }
    }

    // Parsing Excel
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    let successCount = 0;
    let failCount = 0;

    // Loop data dari Excel dan masukkan ke DB
    for (const row of jsonData as any[]) {
      try {
        const namaLengkap = row['Nama Lengkap'] || row['nama'] || row['Nama'];
        if (!namaLengkap) {
          failCount++;
          continue; // Lewati baris yang kosong atau tidak ada namanya
        }

        const jkStr = (row['Jenis Kelamin'] || '').toString().toLowerCase();
        const jenisKelamin = (jkStr.includes('perempuan') || jkStr === 'p' || jkStr === 'pr') ? 'PEREMPUAN' : 'LAKI_LAKI';

        const nia = row['NIA / KTA'] || row['nia'] || row['NIA'] || null;

        const namaKom = row['Komisariat'] ? String(row['Komisariat']).trim().toLowerCase() : '';
        const namaRayon = row['Rayon'] ? String(row['Rayon']).trim().toLowerCase() : '';
        
        let komisariatId = komMap.get(namaKom) || null;
        let rayonId = rayonMap.get(namaRayon) || null;

        // Force scope security (Sekretaris Komisariat tidak boleh import kader untuk Komisariat lain)
        if ((scopeFilter as any).komisariatId) komisariatId = (scopeFilter as any).komisariatId;
        if ((scopeFilter as any).rayonId) rayonId = (scopeFilter as any).rayonId;

        await prisma.kader.create({
          data: {
            namaLengkap: String(namaLengkap),
            nia: nia ? String(nia) : null,
            jenisKelamin,
            tempatLahir: row['Tempat Lahir'] ? String(row['Tempat Lahir']) : null,
            // (Abaikan parsing tanggal kompleks dari excel untuk MVP ini agar tidak error timezone)
            tanggalLahir: null, 
            noTelepon: row['No. HP'] ? String(row['No. HP']) : null,
            alamat: row['Alamat'] ? String(row['Alamat']) : null,
            asalKampus: row['Kampus'] ? String(row['Kampus']) : null,
            fakultas: row['Fakultas'] ? String(row['Fakultas']) : null,
            jurusan: row['Jurusan'] ? String(row['Jurusan']) : null,
            tahunMasuk: row['Tahun Masuk'] ? parseInt(row['Tahun Masuk']) : null,
            komisariatId,
            rayonId,
            statusMapaba: row['Status MAPABA']?.toString().toLowerCase().includes('lulus') || false,
            statusPKD: row['Status PKD']?.toString().toLowerCase().includes('lulus') || false,
            statusPKL: row['Status PKL']?.toString().toLowerCase().includes('lulus') || false,
          }
        });
        successCount++;
      } catch (err: any) {
        // Jika duplikat NIA atau error lain, lewati baris ini (tidak memberhentikan seluruh proses)
        console.error('Error import baris:', err.message);
        failCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Impor Selesai! ${successCount} berhasil dimasukkan, ${failCount} gagal (duplikat/data tidak valid).` 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
