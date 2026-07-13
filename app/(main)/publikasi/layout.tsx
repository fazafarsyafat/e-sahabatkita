'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const tabs = [
  { href: '/publikasi/berita', label: 'Berita' },
  { href: '/publikasi/agenda', label: 'Agenda' },
  { href: '/publikasi/galeri', label: 'Galeri' },
];

export default function PublikasiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="pt-16">
      {/* Header Publikasi */}
      <section className="bg-primary-50 dark:bg-primary-900/10 border-b border-primary-100 dark:border-primary-900/20 pt-12 pb-16 text-center">
        <div className="container-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              Pusat <span className="text-primary-600">Publikasi</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Berita terkini, agenda kegiatan, dan dokumentasi pergerakan PMII Kabupaten Bandung.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tab Menu */}
      <div className="sticky top-16 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="container-lg">
          <div className="flex overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => {
              // Exact match or sub-path match for active state
              const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
              
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`relative px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-primary-600'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="publikasi-tab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
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
        {children}
      </div>
    </div>
  );
}
