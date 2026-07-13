'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileSignature, Award, ArrowRight } from 'lucide-react';

const layananSurat = [
  {
    title: 'Pengajuan Surat Umum',
    desc: 'Layanan bagi kader dan pengurus untuk mengajukan permohonan surat keterangan aktif, mandat, audiensi, maupun surat resmi lainnya ke tingkat Cabang.',
    icon: FileSignature,
    href: '/surat/pengajuan-surat',
    color: 'from-green-500 to-green-700',
    bgColor: 'bg-green-50 dark:bg-green-900/10'
  },
  {
    title: 'Pengajuan SK Kepengurusan',
    desc: 'Fasilitas pendaftaran dan unggah persyaratan penerbitan Surat Keputusan (SK) bagi struktur kepengurusan tingkat Rayon maupun Komisariat yang baru dilantik.',
    icon: Award,
    href: '/surat/pengajuan-sk',
    color: 'from-blue-500 to-blue-700',
    bgColor: 'bg-blue-50 dark:bg-blue-900/10'
  }
];

export default function SuratLandingPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Pilih Layanan Persuratan
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Gunakan formulir digital untuk mempercepat proses birokrasi dan verifikasi dokumen.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {layananSurat.map((layanan, i) => (
          <Link key={i} href={layanan.href} className="block group">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`h-full bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${layanan.bgColor} rounded-bl-full -z-0 transition-transform group-hover:scale-150 duration-500`} />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${layanan.color} flex items-center justify-center text-white shadow-lg mb-8`}>
                  <layanan.icon size={32} />
                </div>
                
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                  {layanan.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 flex-1">
                  {layanan.desc}
                </p>

                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold group-hover:gap-4 transition-all mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
                  Ajukan Sekarang <ArrowRight size={18} />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

    </div>
  );
}
