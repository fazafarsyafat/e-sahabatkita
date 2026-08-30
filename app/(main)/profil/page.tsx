'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { History, Target, Network, ArrowRight } from 'lucide-react';

const profilMenus = [
  {
    title: 'Sejarah PMII',
    desc: 'Mengenal sejarah berdirinya PMII dan perjalanannya di Kabupaten Bandung.',
    icon: History,
    href: '/profil/sejarah',
    color: 'from-blue-500 to-blue-700'
  },
  {
    title: 'Visi & Misi',
    desc: 'Arah gerak, tujuan, dan landasan perjuangan organisasi.',
    icon: Target,
    href: '/profil/visi-misi',
    color: 'from-gold-500 to-gold-600'
  },
  {
    title: 'Struktur Pengurus',
    desc: 'Susunan kepengurusan PMII Kabupaten Bandung periode saat ini.',
    icon: Network,
    href: '/profil/struktur',
    color: 'from-primary-500 to-primary-700'
  }
];

export default function ProfilLandingPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Jelajahi Profil Organisasi
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Pilih salah satu menu di bawah ini untuk melihat informasi lebih detail.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {profilMenus.map((menu, i) => (
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
                Lihat Detail <ArrowRight size={16} />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

    </div>
  );
}
