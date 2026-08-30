'use client';

import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';

// Karena belum ada mock data galeri, kita buat dummy lokal sementara
const mockGaleri = Array.from({ length: 9 }).map((_, i) => ({
  id: i,
  title: `Dokumentasi Kegiatan ${i + 1}`,
  image: `https://picsum.photos/seed/pmii${i}/600/400`,
  date: '12 Jul 2026'
}));

export default function GaleriPage() {
  return (
    <div className="space-y-8">
      
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Camera className="text-primary-600" /> Album Foto
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {mockGaleri.map((foto, i) => (
          <motion.div
            key={foto.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group relative rounded-2xl overflow-hidden aspect-square bg-gray-100 dark:bg-gray-800 cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={foto.image} 
              alt={foto.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <h4 className="text-white font-bold text-lg mb-1">{foto.title}</h4>
              <p className="text-gray-300 text-xs font-medium">{foto.date}</p>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
