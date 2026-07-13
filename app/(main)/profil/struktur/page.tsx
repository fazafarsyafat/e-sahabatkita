'use client';

import { motion } from 'framer-motion';
import { UserCircle, Network } from 'lucide-react';

const strukturPengurus = [
  { divisi: 'Badan Pengurus Harian', anggota: [
    { jabatan: 'Ketua Umum', nama: 'H. Ahmad Zaenuri, S.Pd.' },
    { jabatan: 'Wakil Ketua I (Internal)', nama: 'Muhammad Iqbal, S.H.' },
    { jabatan: 'Wakil Ketua II (Eksternal)', nama: 'Rudi Hermawan, S.Sos.' },
    { jabatan: 'Wakil Ketua III (Keagamaan)', nama: 'M. Ali Fikri, S.Ud.' },
    { jabatan: 'Sekretaris Umum', nama: 'Siti Aisyah, S.Sos.' },
    { jabatan: 'Bendahara Umum', nama: 'Rizky Pratama, S.E.' },
  ]},
  { divisi: 'Biro / Lembaga', anggota: [
    { jabatan: 'Biro Kaderisasi', nama: 'Fahmi Abdillah, S.T.' },
    { jabatan: 'Biro Hubungan Antar Lembaga', nama: 'Agus Salim, S.IP.' },
    { jabatan: 'Lembaga Pers & Jurnalistik', nama: 'Nadia Saphira, S.I.Kom.' },
    { jabatan: 'Lembaga Kajian Keislaman', nama: 'Ust. Zainuddin, S.Ag.' },
  ]}
];

export default function StrukturPage() {
  return (
    <div className="max-w-5xl mx-auto">
      
      <div className="flex items-center justify-center gap-3 mb-12 text-center">
        <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-2xl">
          <Network size={28} className="text-primary-600 dark:text-primary-400" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white">Susunan Pengurus</h2>
      </div>

      <div className="space-y-16">
        {strukturPengurus.map((grup, i) => (
          <div key={i}>
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{grup.divisi}</h3>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {grup.anggota.map((pengurus, j) => (
                <motion.div
                  key={j}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (i * 0.1) + (j * 0.05) }}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                      <UserCircle size={28} className="text-gray-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1 leading-tight">
                        {pengurus.nama}
                      </h4>
                      <div className="text-sm font-medium text-primary-600 dark:text-primary-400">
                        {pengurus.jabatan}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
