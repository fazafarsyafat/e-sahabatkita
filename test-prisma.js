const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const newProgram = await prisma.programKaderisasi.create({
      data: {
        jenis: 'MAPABA',
        angkatan: 'XX',
        tanggalMulai: new Date(),
        tanggalSelesai: new Date(),
        lokasi: 'Test',
        komisariat: null,
        deskripsi: null,
        status: 'OPEN'
      }
    });
    console.log(newProgram);
  } catch(e) {
    console.error("ERROR:", e.message);
  }
}
test();
