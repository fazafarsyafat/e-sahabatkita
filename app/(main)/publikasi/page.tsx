'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Newspaper, Calendar, Image as ImageIcon, ArrowRight } from 'lucide-react';

const publikasiMenus = [
  {
    title: 'Berita Terkini',
    desc: 'Informasi terbaru seputar kegiatan, opini, dan rilis resmi dari PMII Kabupaten Bandung.',
    icon: Newspaper,
    href: '/publikasi/berita',
    color: 'from-primary-500 to-primary-700'
  },
  {
    title: 'Agenda Kegiatan',
    desc: 'Jadwal pelatihan, rapat kerja, dan berbagai aktivitas organisasi lainnya.',
    icon: Calendar,
    href: '/publikasi/agenda',
    color: 'from-gold-500 to-gold-600'
  }
];

export default function PublikasiLandingPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Jelajahi Publikasi
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Pilih salah satu kategori di bawah ini untuk melihat publikasi selengkapnya.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {publikasiMenus.map((menu, i) => (
          <Link key={i} href={menu.href}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 h-full shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${menu.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <menu.icon size={28} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {menu.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                {menu.desc}
              </p>

              <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 text-sm font-semibold group-hover:gap-3 transition-all">
                Lihat Semua <ArrowRight size={16} />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

    </div>
  );
}
