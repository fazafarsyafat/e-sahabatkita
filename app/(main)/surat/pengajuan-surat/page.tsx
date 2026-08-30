'use client';

import { motion } from 'framer-motion';
import { FileSignature, LogIn, Phone, FileText, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function PengajuanSuratPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white shadow-lg flex-shrink-0">
          <FileSignature size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Pengajuan Surat Cabang</h2>
          <p className="text-gray-600 dark:text-gray-400">Informasi dan prosedur permohonan penerbitan surat resmi dari Cabang.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
              Persyaratan Pengajuan Surat
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Sebelum mengajukan permohonan surat (seperti Surat Keterangan Aktif, Mandat, Audiensi, Rekomendasi, dll), pastikan Anda telah menyiapkan hal-hal berikut:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                <span className="text-gray-700 dark:text-gray-300">Tujuan dan perihal surat yang jelas (Instansi tujuan, tanggal kegiatan, dll).</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                <span className="text-gray-700 dark:text-gray-300">Draf atau konsep surat (jika ada format khusus yang diminta).</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                <span className="text-gray-700 dark:text-gray-300">Dokumen pendukung lainnya yang relevan dengan jenis surat yang diajukan.</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/50">
            <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
              <FileText size={20} /> Prosedur Pengajuan
            </h4>
            <p className="text-blue-800 dark:text-blue-200 mb-6">
              Saat ini, seluruh proses administrasi dan pengajuan surat dilakukan terpusat melalui <strong>Dashboard Sistem</strong>. Anda harus memiliki akun dan masuk ke dalam sistem untuk mengajukan surat.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-center shadow-md">
                <LogIn size={18} /> Masuk ke Dashboard
              </Link>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
             <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
               Belum punya akun?
             </h4>
             <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
               Hanya pengurus yang terdaftar yang dapat mengakses Dashboard. Jika Anda adalah pengurus (Rayon/Komisariat) namun belum memiliki akun, silakan hubungi Administrator Cabang untuk mendaftar.
             </p>
             <a href="https://wa.me/6285871474769" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-green-600 dark:text-green-400 hover:underline">
               <Phone size={16} /> Hubungi Admin Cabang
             </a>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
