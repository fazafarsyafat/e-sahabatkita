'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Trophy } from 'lucide-react';

export default function PklMateriPage() {
  const [materi, setMateri] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMateri = async () => {
      try {
        const res = await fetch('/api/materi?jenjang=PKL');
        const data = await res.json();
        if(Array.isArray(data)) setMateri(data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchMateri();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
          <Trophy size={32} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Materi Induk Pelatihan Kader Lanjut (PKL)</h2>
        <p className="text-gray-500 dark:text-gray-400">Modul tingkat mahir untuk kader mujtahid PMII (Kader Intelektual).</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 text-center text-gray-500 py-10">Memuat materi...</div>
        ) : materi.length === 0 ? (
          <div className="col-span-2 text-center text-gray-500 py-10">Belum ada materi untuk jenjang ini.</div>
        ) : (
          materi.map((item, i) => (
            <motion.div
              key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-lg flex items-center justify-center shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-green-600 transition-colors">{item.judul}</h4>
                  <div className="text-xs text-gray-500 font-medium">{item.format} • {item.ukuran}</div>
                </div>
              </div>
              <a href={item.fileUrl} target="_blank" className="btn-ghost p-2 rounded-full text-gray-400 hover:text-green-600 hover:bg-green-50">
                <Download size={18} />
              </a>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
