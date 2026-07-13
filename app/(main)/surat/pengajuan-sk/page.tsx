'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, UploadCloud, Send, CheckCircle, Info } from 'lucide-react';

export default function PengajuanSKPage() {
  const [activeTab, setActiveTab] = useState<'rayon' | 'komisariat'>('rayon');
  const [formState, setFormState] = useState<'idle' | 'uploading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('uploading');
    setTimeout(() => {
      setFormState('success');
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg flex-shrink-0">
          <Award size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Pengajuan SK Kepengurusan</h2>
          <p className="text-gray-600 dark:text-gray-400">Pilih tingkatan struktur (Rayon/Komisariat) dan unggah kelengkapan administrasi hasil pemilihan.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
        
        {formState === 'idle' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Custom Tabs */}
            <div className="flex bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
              <button 
                onClick={() => setActiveTab('rayon')}
                className={`flex-1 py-4 text-center font-bold text-sm transition-colors relative ${activeTab === 'rayon' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}
              >
                Tingkat Rayon
                {activeTab === 'rayon' && <motion.div layoutId="skTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-500" />}
              </button>
              <button 
                onClick={() => setActiveTab('komisariat')}
                className={`flex-1 py-4 text-center font-bold text-sm transition-colors relative ${activeTab === 'komisariat' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}
              >
                Tingkat Komisariat
                {activeTab === 'komisariat' && <motion.div layoutId="skTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-500" />}
              </button>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <div className="bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 p-4 rounded-xl text-sm mb-6 flex items-start gap-3">
                <Info size={20} className="flex-shrink-0 mt-0.5" />
                <p>
                  Pengajuan SK <strong>{activeTab === 'rayon' ? 'Rayon' : 'Komisariat'}</strong> diwajibkan melampirkan berkas fisik rangkap 2 (dua) yang diserahkan langsung ke kesekretariatan Cabang setelah formulir digital ini diverifikasi.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nama {activeTab === 'rayon' ? 'Rayon' : 'Komisariat'}</label>
                    <input required type="text" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={`Misal: ${activeTab === 'rayon' ? 'Rayon Hukum' : 'Komisariat UIN'}`} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Periode Kepengurusan</label>
                    <input required type="text" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Misal: 2026-2027" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nama Ketua Terpilih</label>
                    <input required type="text" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nama lengkap..." />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Asal {activeTab === 'rayon' ? 'Komisariat' : 'Cabang'}</label>
                    {activeTab === 'rayon' ? (
                      <input required type="text" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Komisariat penaung..." />
                    ) : (
                      <input required readOnly type="text" className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-500 rounded-xl px-4 py-3" defaultValue="Kabupaten Bandung" />
                    )}
                  </div>
                </div>

                {/* Upload Persyaratan */}
                <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 md:p-8 text-center bg-gray-50/50 dark:bg-gray-800/30">
                  <div className="flex justify-center mb-3 text-blue-500">
                    <UploadCloud size={32} />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Unggah Berkas Persyaratan Penerbitan SK</h4>
                  <ul className="text-xs text-gray-500 text-left max-w-sm mx-auto list-disc pl-5 mb-4 space-y-1">
                    <li>Berita Acara {activeTab === 'rayon' ? 'RTAR' : 'RTK'} (Format PDF)</li>
                    <li>Surat Permohonan SK {activeTab === 'rayon' ? '(Disertai Rekomendasi Komisariat)' : '(Kop Komisariat)'}</li>
                    <li>Daftar Susunan Pengurus (PDF)</li>
                  </ul>
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-400 mb-4">*Satukan seluruh berkas di atas dalam 1 file ZIP (Maks. 20MB)</p>
                  
                  <button type="button" className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-bold px-6 py-2 rounded-lg hover:bg-blue-200 transition-colors">
                    Pilih File ZIP
                  </button>
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 text-lg">
                    <Send size={20} /> Ajukan SK Kepengurusan
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {formState === 'uploading' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-6" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Mengunggah & Memvalidasi...</h3>
            <p className="text-gray-500 text-sm max-w-xs">Sistem sedang mengirim berkas Anda ke pangkalan data (database) Cabang.</p>
          </motion.div>
        )}

        {formState === 'success' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-20 text-center px-6">
            <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/20">
              <CheckCircle size={48} />
            </div>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Pengajuan SK Berhasil!</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
              Berkas formatur kepengurusan {activeTab === 'rayon' ? 'Rayon' : 'Komisariat'} Anda telah kami terima secara digital. <br/><br/>
              Harap pantau terus status pengajuan ini dari dashboard, dan jangan lupa menyerahkan <strong>berkas fisik (Hardcopy)</strong> rangkap 2 ke kesekretariatan.
            </p>
            <button onClick={() => setFormState('idle')} className="text-blue-600 font-bold hover:underline">
              Kembali ke Form
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
}
