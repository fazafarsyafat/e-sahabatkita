'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const tabs = [
  { href: '/kaderisasi', label: 'Borang & Presensi' },
  { href: '/kaderisasi/mapaba', label: 'Materi MAPABA' },
  { href: '/kaderisasi/pkd', label: 'Materi PKD' },
  { href: '/kaderisasi/pkl', label: 'Materi PKL' },
];

export default function KaderisasiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="pt-16">
      {/* Header Kaderisasi */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-950 pt-16 pb-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        <div className="container-lg relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-gold-300 text-sm font-bold mb-6 tracking-widest uppercase shadow-xl">
              Modul Kaderisasi Formal
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
              Bina Kader <span className="gold-gradient-text">Berintegritas</span>
            </h1>
            <p className="text-primary-100 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
              Sistem manajemen jenjang kaderisasi PMII Kabupaten Bandung. Akses materi, absensi RTL, dan pengajuan screening secara terpusat.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tab Menu Khusus Jenjang */}
      <div className="sticky top-16 z-40 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="container-lg">
          <div className="flex overflow-x-auto hide-scrollbar justify-center md:justify-start">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href || (pathname.startsWith(tab.href) && tab.href !== '/kaderisasi');
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`relative px-8 py-5 text-sm md:text-base font-bold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="kaderisasi-tab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 dark:bg-primary-500 rounded-t-full"
                      initial={false}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pt-10 pb-20">
        <div className="container-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
