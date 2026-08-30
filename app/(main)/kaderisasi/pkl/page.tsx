'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Trophy, Calendar, MapPin } from 'lucide-react';

import { cn, formatDate } from '@/lib/utils';

export default function PklMateriPage() {
  const [materi, setMateri] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loadingMateri, setLoadingMateri] = useState(true);
  const [loadingPrograms, setLoadingPrograms] = useState(true);

  useEffect(() => {
    const fetchMateri = async () => {
      try {
        const res = await fetch('/api/materi?jenjang=PKL');
        const data = await res.json();
        if(Array.isArray(data)) setMateri(data);
      } catch (e) {
        console.error(e);
      }
      setLoadingMateri(false);
    };

    const fetchPrograms = async () => {
      try {
        const res = await fetch('/api/kaderisasi');
        const data = await res.json();
        if(Array.isArray(data)) {
          setPrograms(data.filter(p => p.jenis === 'PKL'));
        }
      } catch (e) {
        console.error(e);
      }
      setLoadingPrograms(false);
    };

    fetchMateri();
    fetchPrograms();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Bagian Materi */}
      <section>
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
            <Trophy size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Materi Induk PKL</h2>
          <p className="text-gray-500 dark:text-gray-400">Unduh dan pelajari modul-modul wajib Pelatihan Kader Lanjut (PKL).</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {loadingMateri ? (
            <div className="col-span-2 text-center text-gray-500 py-10">Memuat materi...</div>
          ) : materi.length === 0 ? (
            <div className="col-span-2 text-center text-gray-500 py-10">Belum ada materi untuk jenjang ini.</div>
          ) : (
            materi.map((item, i) => (
              <motion.div
                key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-lg flex items-center justify-center shrink-0">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-green-600 transition-colors">{item.judul}</h4>
                    <div className="text-xs text-gray-500 font-medium">{item.format} • {item.ukuran}</div>
                  </div>
                </div>
                <a href={item.fileUrl} target="_blank" className="btn-ghost p-2 rounded-full text-gray-400 hover:text-green-600 hover:bg-green-50">
                  <Download size={18} />
                </a>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Bagian Jadwal */}
      <section className="pt-10 border-t border-gray-100 dark:border-gray-800">
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Jadwal Pelaksanaan PKL</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Daftar kegiatan PKL yang sedang atau akan berlangsung.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {loadingPrograms ? (
            <div className="col-span-2 text-center py-10 text-gray-500">Memuat jadwal...</div>
          ) : programs.length === 0 ? (
            <div className="col-span-2 text-center py-10 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-gray-500">Belum ada jadwal PKL saat ini.</div>
          ) : (
            programs.map((program, i) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
                      <Trophy size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">{program.jenis} {program.angkatan}</h3>
                      <p className="text-xs text-gray-500">{program.komisariat?.nama || 'Tingkat Cabang'}</p>
                    </div>
                  </div>
                  <span className={cn('badge text-[10px]', program.status === 'OPEN' ? 'badge-blue' : program.status === 'ONGOING' ? 'badge-gold' : 'badge-green')}>
                    {program.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-2">
                  {program.deskripsi || 'Kegiatan kaderisasi tingkat mahir PMII.'}
                </p>

                <div className="grid grid-cols-2 gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                    <Calendar size={14} className="text-primary-500" />
                    <span>{formatDate(program.tanggalMulai)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                    <MapPin size={14} className="text-primary-500" />
                    <span className="truncate">{program.lokasi}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
