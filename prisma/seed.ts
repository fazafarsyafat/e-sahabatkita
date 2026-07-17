import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Master Organisasi...')

  // 1. Seed Komisariat
  const komisariatList = [
    { nama: 'PK PMII UIN Sunan Gunung Djati Bandung' },
    { nama: 'PK PMII STAI Yapata Al-Jawami' },
    { nama: 'PK PMII STAI Al-Falah' },
    { nama: 'PK PMII Universitas Bale Bandung' },
    { nama: 'PK PMII STAI Baitul Arqom' },
    { nama: 'PK PMII STAI Yamisa' },
    { nama: 'PK PMII Institut Darul Falah' },
    { nama: 'PK PMII STAI Pelita Nusa' },
  ]

  const createdKomisariats = []
  for (const kom of komisariatList) {
    const k = await prisma.komisariat.upsert({
      where: { nama: kom.nama },
      update: {},
      create: { nama: kom.nama },
    })
    createdKomisariats.push(k)
  }

  // 2. Seed Rayon (Hanya untuk UIN)
  const uin = createdKomisariats.find(k => k.nama === 'PK PMII UIN Sunan Gunung Djati Bandung')
  
  if (uin) {
    const rayonList = [
      'Rayon Tarbiyah',
      'Rayon Sains dan Teknologi',
      'Rayon Adab dan Humaniora',
      'Rayon Ushuluddin',
      'Rayon Syari\'ah dan Hukum',
      'Rayon Ekonomi dan Bisnis Islam',
      'Rayon Ilmu Sosial dan Ilmu Politik',
      'Rayon Dakwah dan Komunikasi'
    ]

    for (const r of rayonList) {
      await prisma.rayon.upsert({
        where: { nama_komisariatId: { nama: r, komisariatId: uin.id } },
        update: {},
        create: {
          nama: r,
          komisariatId: uin.id
        }
      })
    }
  }

  console.log('Master Organisasi berhasil di-seed!')

  // 3. (Opsional) Seed Super Admin Cabang
  const adminPassword = await bcrypt.hash('password123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@pmii.or.id' },
    update: {},
    create: {
      name: 'Super Admin PC',
      email: 'admin@pmii.or.id',
      password: adminPassword,
      role: 'SUPER_ADMIN',
      statusApproval: 'APPROVED'
    }
  })

  console.log('Super Admin berhasil di-seed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
