'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <div className="text-9xl font-black gradient-text mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Halaman Tidak Ditemukan</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Halaman yang Anda cari tidak ada atau telah dipindahkan. Periksa URL atau kembali ke beranda.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-primary">
            <Home size={15} /> Beranda
          </Link>
          <Link href="/dashboard" className="btn-ghost border border-gray-200 dark:border-gray-700">
            <ArrowLeft size={15} /> Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
