'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export default function CekTTDPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-20 px-4">
      <div className="text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/20 text-blue-600 dark:text-blue-400 mb-8 shadow-sm border border-blue-200/50 dark:border-blue-700/50"
        >
          <Clock size={48} />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6"
        >
          Fitur <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Cek TTD Digital</span> <br/> Segera Hadir
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl mx-auto"
        >
          Kami sedang mengembangkan fitur untuk memverifikasi keaslian Tanda Tangan Digital pada dokumen yang diterbitkan oleh sistem E-Sahabat. Nantikan pembaruannya!
        </motion.p>
      </div>
    </div>
  );
}
