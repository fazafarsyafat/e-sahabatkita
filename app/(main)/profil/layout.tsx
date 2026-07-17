'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const tabs = [
  { href: '/profil/sejarah', label: 'Sejarah' },
  { href: '/profil/visi-misi', label: 'Visi Misi' },
  { href: '/profil/struktur', label: 'Struktur Pengurus' },
];

export default function ProfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="pt-16">
      {/* Header/Hero Profil */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 pt-10 pb-12 md:pt-16 md:pb-20 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 md:w-80 h-64 md:h-80 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-cyan-400/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        
        <div className="container-lg relative z-10 px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-block px-3 py-1 md:px-4 md:py-1.5 bg-white/10 backdrop-blur-md rounded-full text-blue-100 text-xs md:text-sm font-bold mb-4 md:mb-6 tracking-widest uppercase shadow-xl">
              Tentang Kami
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6 leading-tight">
              Profil <span className="text-cyan-300">PMII</span>
            </h1>
            <p className="text-blue-100 text-base md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
              Mengenal lebih dekat Pergerakan Mahasiswa Islam Indonesia Cabang Kabupaten Bandung.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tab Menu */}
      <div className="sticky top-16 z-40 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="container-lg">
          <div className="flex overflow-x-auto hide-scrollbar justify-start md:justify-center">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`relative px-5 py-3 md:px-8 md:py-5 text-sm md:text-base font-bold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="profil-tab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-500 rounded-t-full"
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
      <div className="container-lg py-12">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
