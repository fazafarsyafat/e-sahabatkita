'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Network, Loader2 } from 'lucide-react';

interface Pengurus {
  id: string;
  nama: string;
  jabatan: string;
  divisi: string;
  urutan: number;
}

export default function StrukturPage() {
  const [strukturPengurus, setStrukturPengurus] = useState<{ divisi: string, anggota: Pengurus[] }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPengurus = async () => {
      try {
        const res = await fetch('/api/pengurus');
        const data: Pengurus[] = await res.json();
        
        // Group by divisi
        const grouped = data.reduce((acc, curr) => {
          if (!acc[curr.divisi]) {
            acc[curr.divisi] = [];
          }
          acc[curr.divisi].push(curr);
          return acc;
        }, {} as Record<string, Pengurus[]>);

        // Convert to array
        const formatted = Object.keys(grouped).map(key => ({
          divisi: key,
          anggota: grouped[key]
        }));

        setStrukturPengurus(formatted);
      } catch (error) {
        console.error("Failed to fetch pengurus", error);
      }
      setIsLoading(false);
    };

    fetchPengurus();
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      
      <div className="flex items-center justify-center gap-3 mb-12 text-center">
        <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-2xl">
          <Network size={28} className="text-primary-600 dark:text-primary-400" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white">Susunan Pengurus</h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin text-primary-500" size={40} />
        </div>
      ) : strukturPengurus.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Struktur pengurus belum diperbarui oleh Admin.
        </div>
      ) : (
        <div className="space-y-16">
          {strukturPengurus.map((grup, i) => (
            <div key={i}>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{grup.divisi}</h3>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {grup.anggota.map((pengurus, j) => (
                  <motion.div
                    key={pengurus.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (i * 0.1) + (j * 0.05) }}
                    className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                        <UserCircle size={28} className="text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1 leading-tight">
                          {pengurus.nama}
                        </h4>
                        <div className="text-sm font-medium text-primary-600 dark:text-primary-400">
                          {pengurus.jabatan}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
