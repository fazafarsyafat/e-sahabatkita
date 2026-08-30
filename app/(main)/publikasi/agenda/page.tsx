'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Tag } from 'lucide-react';

export default function AgendaPage() {
  const [agendas, setAgendas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/agenda')
      .then(res => res.json())
      .then(data => {
        setAgendas(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div className="py-20 text-center text-gray-500 font-medium">Memuat arsip agenda...</div>;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {agendas.length === 0 ? (
        <div className="py-20 text-center text-gray-500 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
          Belum ada jadwal kegiatan yang dipublikasikan.
        </div>
      ) : (
        <div className="space-y-6">
          {agendas.map((agenda, i) => (
            <motion.div
              key={agenda.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-6 items-start hover:shadow-md transition-shadow"
            >
              {/* Tanggal Box */}
              <div className={`w-full md:w-32 flex-shrink-0 flex flex-col items-center justify-center p-4 rounded-2xl ${agenda.status === 'Mendatang' ? 'bg-gold-50 dark:bg-gold-900/20 text-gold-600 dark:text-gold-400' : 'bg-gray-50 dark:bg-gray-800 text-gray-500'}`}>
                <span className="text-sm font-bold uppercase mb-1">
                  {new Date(agenda.waktuPelaksanaan).toLocaleString('id-ID', { month: 'short' })}
                </span>
                <span className="text-4xl font-black leading-none">
                  {new Date(agenda.waktuPelaksanaan).getDate()}
                </span>
                <span className="text-xs font-medium mt-1">
                  {new Date(agenda.waktuPelaksanaan).getFullYear()}
                </span>
              </div>

              {/* Info Agenda */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${agenda.status === 'Mendatang' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300' : agenda.status === 'Selesai' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
                    {agenda.status}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                    <Tag size={12} /> {agenda.kategori}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                  {agenda.judul}
                </h3>

                <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-primary-500 flex-shrink-0" /> {new Date(agenda.waktuPelaksanaan).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})} WIB
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-primary-500 flex-shrink-0" /> <span className="truncate">{agenda.lokasi}</span>
                  </div>
                </div>
                
                {agenda.deskripsi && (
                  <p className="text-sm text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-4 mt-2">
                    {agenda.deskripsi}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
