'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileSignature, Send, CheckCircle } from 'lucide-react';

export default function PengajuanSuratPage() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setTimeout(() => {
      setFormState('success');
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white shadow-lg flex-shrink-0">
          <FileSignature size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Pengajuan Surat Cabang</h2>
          <p className="text-gray-600 dark:text-gray-400">Silakan isi formulir untuk memohon penerbitan surat resmi dari Cabang.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
        
        {formState === 'idle' && (
          <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nama Pemohon</label>
                <input required type="text" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Nama Lengkap..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Asal Rayon / Komisariat</label>
                <input required type="text" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Cth: Komisariat UIN..." />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Jenis Surat yang Diminta</label>
              <select required className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 dark:text-gray-300">
                <option value="">-- Pilih Jenis Surat --</option>
                <option value="mandat">Surat Mandat</option>
                <option value="keterangan_aktif">Surat Keterangan Aktif</option>
                <option value="rekomendasi">Surat Rekomendasi</option>
                <option value="peminjaman">Surat Peminjaman Tempat/Alat</option>
                <option value="audiensi">Surat Permohonan Audiensi</option>
                <option value="lainnya">Lainnya...</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Perihal / Keperluan</label>
              <input required type="text" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Misal: Mandat peserta Halaqoh Nasional" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Instansi/Pihak Tujuan (Opsional)</label>
              <input type="text" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Misal: PB PMII, Rektorat, Kepala Desa..." />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Keterangan Tambahan</label>
              <textarea rows={4} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Berikan detail tambahan jika ada (misal: waktu dan tempat kegiatan)..." />
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 text-lg">
                <Send size={20} /> Kirim Pengajuan
              </button>
            </div>
          </motion.form>
        )}

        {formState === 'submitting' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mb-6" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Memproses Pengajuan...</h3>
            <p className="text-gray-500 text-sm">Menghubungkan ke server persuratan Cabang.</p>
          </motion.div>
        )}

        {formState === 'success' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-16 text-center">
            <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/20">
              <CheckCircle size={48} />
            </div>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Pengajuan Terkirim!</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
              Formulir pengajuan surat Anda telah berhasil masuk ke antrean persuratan Sekretaris Cabang. Surat akan diproses maksimal 1x24 Jam kerja.
            </p>
            <button onClick={() => setFormState('idle')} className="text-green-600 font-bold hover:underline">
              Ajukan Surat Lainnya
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
}
