'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, FileSignature, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CekTTDPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden py-20 px-4">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -right-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ 
            rotate: -360,
            scale: [1, 1.5, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -left-1/4 w-[30rem] h-[30rem] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[120px]"
        />
      </div>

      <div className="text-center max-w-2xl mx-auto relative z-10">
        
        {/* Main Icon with Scanning Effect */}
        <div className="relative inline-flex items-center justify-center mb-10 group">
          {/* Outer glowing ring */}
          <motion.div
            animate={{ 
              boxShadow: ['0 0 0 0 rgba(59, 130, 246, 0)', '0 0 0 20px rgba(59, 130, 246, 0.1)', '0 0 0 40px rgba(59, 130, 246, 0)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative w-32 h-32 rounded-3xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-center overflow-hidden"
          >
            {/* The Scanner Line Animation */}
            <motion.div 
              animate={{ top: ['-20%', '120%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-blue-500/50 shadow-[0_0_15px_5px_rgba(59,130,246,0.4)] z-20"
            />
            
            <div className="relative z-10 flex text-blue-600 dark:text-blue-400">
              <FileSignature size={48} className="absolute opacity-20 -top-2 -left-2" />
              <ShieldCheck size={56} className="relative z-10" />
            </div>
            
            {/* Subtle inner grid/dots for techy feel */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 to-transparent dark:from-blue-900/20" />
          </motion.div>
        </div>
        
        {/* Text Elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
          className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/50 dark:border-gray-800 shadow-xl"
        >
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold border border-blue-200 dark:border-blue-800/50 shadow-sm">
            Fase Pengembangan
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
            Verifikasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Keaslian Surat</span> <br className="hidden md:block" />Lebih Aman
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl mx-auto mb-10">
            Sistem E-Sahabat sedang menyiapkan infrastruktur <strong className="text-gray-900 dark:text-white">Tanda Tangan Digital (Digital Signature)</strong> dengan enkripsi canggih untuk menjamin otentikasi dokumen secara instan dan akurat.
          </p>

          <Link href="/surat">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 dark:from-white dark:to-gray-100 dark:hover:from-gray-100 dark:hover:to-gray-200 text-white dark:text-gray-900 font-bold transition-all shadow-lg shadow-gray-900/20 dark:shadow-white/20"
            >
              <ArrowLeft size={18} />
              Kembali ke Layanan Surat
            </motion.button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
