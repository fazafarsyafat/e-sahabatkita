'use client';

import { motion } from 'framer-motion';
import { Target, CheckCircle2, ShieldCheck } from 'lucide-react';

const misiList = [
  "Menumbuhkembangkan potensi kreatif, keilmuan, dan sosial kemasyarakatan mahasiswa.",
  "Membangun kepribadian mahasiswa yang agamis, nasionalis, dan berintegritas tinggi.",
  "Berperan aktif dalam memecahkan masalah kebangsaan dan kemasyarakatan dengan pendekatan intelektual dan kultural.",
  "Mewujudkan organisasi yang mandiri, adaptif, dan responsif terhadap perkembangan zaman.",
  "Mengamalkan dan mempertahankan nilai-nilai Ahlussunnah wal Jamaah (Aswaja) dalam kehidupan berbangsa dan bernegara."
];

export default function VisiMisiPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Visi Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 md:p-12 shadow-xl text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <Target size={28} className="text-gold-400" />
            </div>
            <h2 className="text-3xl font-black">Visi</h2>
          </div>
          <p className="text-xl md:text-2xl font-medium leading-relaxed text-white/95">
            "Terbentuknya Pribadi Muslim Indonesia yang Bertaqwa kepada Allah SWT, Berbudi Luhur, Berilmu Cakap dan Bertanggung Jawab dalam Mengamalkan Ilmunya Serta Komitmen Memperjuangkan Cita-Cita Kemerdekaan Indonesia."
          </p>
        </div>
      </motion.div>

      {/* Misi Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-2xl">
            <ShieldCheck size={28} className="text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">Misi</h2>
        </div>

        <div className="space-y-4">
          {misiList.map((misi, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-800"
            >
              <div className="mt-1 flex-shrink-0">
                <CheckCircle2 size={24} className="text-primary-500" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {misi}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
