'use client';

import { motion } from 'framer-motion';
import { Award, LogIn, Phone, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function PengajuanSKPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, x: -20 }} 
        animate={{ opacity: 1, x: 0 }} 
        className="flex items-center gap-4 mb-8"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 flex-shrink-0">
          <Award size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Pengajuan SK Kepengurusan</h2>
          <p className="text-gray-600 dark:text-gray-400">Panduan dan persyaratan untuk pengesahan struktur pengurus Rayon dan Komisariat.</p>
        </div>
      </motion.div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible" 
          className="space-y-8"
        >
          
          <motion.div variants={itemVariants} className="bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 p-5 rounded-2xl border border-blue-100 dark:border-blue-800/50 flex items-start gap-3">
             <ShieldAlert size={24} className="flex-shrink-0 mt-0.5" />
             <p className="leading-relaxed">
               <strong>Perhatian:</strong> Penerbitan Surat Keputusan (SK) mensyaratkan <strong>berkas digital</strong> yang diunggah ke sistem dan <strong>berkas fisik (hardcopy) rangkap 2</strong> yang diserahkan ke Cabang setelah diverifikasi.
             </p>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
              Kelengkapan Administrasi (Format PDF)
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Sebelum masuk ke Dashboard, pastikan Anda telah menyiapkan dokumen hasil pemilihan berikut:
            </p>
            <div className="grid gap-4 mt-4">
              {[
                "Berita Acara hasil RTAR (untuk Rayon) atau RTK (untuk Komisariat).",
                "Surat Permohonan Pengesahan SK (Bagi Rayon wajib melampirkan Surat Rekomendasi dari Komisariat).",
                "Daftar Susunan Pengurus Terpilih yang sudah difinalisasi.",
                "Dokumen pelengkap lainnya sesuai pedoman organisasi (bila ada)."
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 transition-transform cursor-default"
                >
                  <div className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 p-1.5 rounded-lg flex-shrink-0">
                    <CheckCircle2 size={18} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 mt-0.5">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl p-6 border border-blue-100/50 dark:border-blue-800/30">
            <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
              <FileText size={20} /> Prosedur Unggah Berkas
            </h4>
            <p className="text-blue-800 dark:text-blue-200 mb-6">
              Pengunggahan berkas dan pemantauan status penerbitan SK dilakukan sepenuhnya melalui <strong>Dashboard Sistem</strong>. Silakan login untuk memulai proses pengajuan.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 text-center">
                <LogIn size={18} /> Masuk ke Dashboard
              </Link>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
             <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
               Kendala Akun Pengurus?
             </h4>
             <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
               Hak akses pengajuan SK hanya diberikan kepada akun pengurus resmi. Jika formatur belum mendapatkan kredensial login, silakan hubungi Administrator Cabang.
             </p>
             <a href="https://wa.me/6285871474769" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
               <Phone size={16} /> Hubungi Admin Cabang
             </a>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
