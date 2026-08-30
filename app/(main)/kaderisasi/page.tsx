'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, MapPin, Calendar, CheckCircle, Clock, X, ArrowRight, ShieldCheck, Settings, GraduationCap, Trophy } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';

const jenjangKaderisasi = [
  {
    title: 'Masa Penerimaan Anggota Baru',
    short: 'MAPABA',
    desc: 'Gerbang awal menjadi anggota PMII. Fokus pada penanaman nilai-nilai dasar pergerakan dan Ahlussunnah wal Jamaah.',
    icon: BookOpen,
    href: '/kaderisasi/mapaba',
    color: 'from-blue-500 to-blue-700',
    bgColor: 'bg-blue-50 dark:bg-blue-900/10'
  },
  {
    title: 'Pelatihan Kader Dasar',
    short: 'PKD',
    desc: 'Pendidikan kader tingkat menengah untuk membentuk kader Mujahid yang militan dan memiliki kapasitas intelektual.',
    icon: GraduationCap,
    href: '/kaderisasi/pkd',
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/10'
  },
  {
    title: 'Pelatihan Kader Lanjut',
    short: 'PKL',
    desc: 'Pendidikan kader tingkat mahir mencetak kader Mujtahid yang mampu merancang strategi dan gerakan skala besar.',
    icon: Trophy,
    href: '/kaderisasi/pkl',
    color: 'from-green-500 to-green-700',
    bgColor: 'bg-green-50 dark:bg-green-900/10'
  }
];

export default function UserKaderisasiPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/kaderisasi');
      const data = await res.json();
      if(Array.isArray(data)) setPrograms(data);
    } catch(e) {
      toast.error('Gagal memuat program kaderisasi');
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Portal Kaderisasi</h2>
        <p className="text-gray-500 dark:text-gray-400">Daftar kegiatan screening dan rekam presensi Anda di sini.</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Memuat program...</div>
      ) : programs.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-gray-500">Belum ada program kaderisasi yang tersedia saat ini.</div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {programs.map((program, i) => {
            // Cek apakah user login (kita asumsikan user sudah login karena bisa masuk sini)
            // Di API, `peserta` dikembalikan semua. Di aplikasi asli, sebaiknya filter di API untuk user ini saja.
            // Tapi karena ini mock up/prototype, kita cari apakah user terdaftar dengan mencocokkan di front-end jika memungkinkan, 
            // ATAU cukup tampilkan tombol dan biarkan API yang menolak jika belum terdaftar.
            // Untuk UI yang lebih baik, asumsikan tombol "Daftar" selalu ada jika OPEN. API akan menangani duplikasinya.

            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">{program.jenis} {program.angkatan}</h3>
                      <p className="text-xs text-gray-500">{program.komisariat || 'Tingkat Cabang'}</p>
                    </div>
                  </div>
                  <span className={cn('badge text-[10px]', program.status === 'OPEN' ? 'badge-blue' : program.status === 'ONGOING' ? 'badge-gold' : 'badge-green')}>
                    {program.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-2">
                  {program.deskripsi || 'Kegiatan kaderisasi wajib untuk melanjutkan jenjang pergerakan.'}
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
            );
          })}
        </div>
      )}

      {/* Bagian Kurikulum & Materi Kaderisasi */}
      <div className="pt-16 border-t border-gray-100 dark:border-gray-800">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Modul & Kurikulum Kaderisasi
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Akses dan pelajari modul materi wajib di setiap tingkatan kaderisasi formal PMII.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {jenjangKaderisasi.map((jenjang, i) => (
            <Link key={i} href={jenjang.href} className="block group">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`h-full bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${jenjang.bgColor} rounded-bl-full -z-0 transition-transform group-hover:scale-150 duration-500`} />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${jenjang.color} flex items-center justify-center text-white shadow-lg`}>
                      <jenjang.icon size={32} />
                    </div>
                    <span className="text-4xl font-black text-gray-100 dark:text-gray-800 group-hover:text-gray-200 dark:group-hover:text-gray-700 transition-colors">
                      {`0${i+1}`}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                    {jenjang.short}
                  </h3>
                  <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                    {jenjang.title}
                  </h4>
                  
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                    {jenjang.desc}
                  </p>

                  <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold group-hover:gap-4 transition-all">
                    Lihat Modul <ArrowRight size={18} />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
