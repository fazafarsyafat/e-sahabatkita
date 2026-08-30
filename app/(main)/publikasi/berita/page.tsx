'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Eye, ArrowRight, FileText } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default function BeritaPage() {
  const [beritas, setBeritas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/berita?published=true')
      .then(res => res.json())
      .then(data => { setBeritas(data); setIsLoading(false); })
      .catch(err => { console.error(err); setIsLoading(false); });
  }, []);

  if (isLoading) return <div className="py-20 text-center text-gray-500 font-medium">Memuat arsip berita...</div>;

  return (
    <div className="space-y-8">
      {beritas.length === 0 ? (
        <div className="py-20 text-center text-gray-500 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
          Belum ada berita yang dipublikasikan.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beritas.map((berita, i) => (
            <motion.div
              key={berita.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-800">
                {berita.gambarSampul ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img 
                    src={berita.gambarSampul} 
                    alt={berita.judul} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 group-hover:scale-105 transition-transform duration-500">
                    <FileText size={40} className="opacity-20" />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  {berita.kategori}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {berita.judul}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3 flex-1">
                  {berita.ringkasan}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {formatDate(berita.createdAt)}</span>
                    <span className="flex items-center gap-1.5"><Eye size={14} /> {berita.viewCount}</span>
                  </div>
                  <Link href={`/berita/${berita.slug}`} className="text-primary-600 dark:text-primary-400 p-2 bg-primary-50 dark:bg-primary-900/20 rounded-full group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
