'use client';

import { motion } from 'framer-motion';
import { History, BookOpen, Users, Star } from 'lucide-react';

export default function SejarahPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800">
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400">
            <History size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Sejarah PMII</h2>
            <div className="text-primary-600 font-medium">Kabupaten Bandung</div>
          </div>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 leading-relaxed space-y-6">
          <p>
            <span className="text-2xl font-black text-primary-600 float-left mr-2 mt-1">P</span>
            ergerakan Mahasiswa Islam Indonesia (PMII) didirikan di Surabaya pada tanggal 17 April 1960 M (bertepatan dengan 21 Syawal 1379 H). Lahirnya PMII bermula dari hasrat kuat para mahasiswa Nahdliyin untuk membentuk suatu wadah yang mengayomi dan mengarahkan aktivitas mahasiswa Islam yang berhaluan Ahlussunnah wal Jamaah (Aswaja).
          </p>

          <p>
            Di Kabupaten Bandung, eksistensi PMII mulai terasa secara signifikan seiring dengan bertumbuhnya perguruan tinggi dan kesadaran kaum muda Nahdliyin. Cabang Kabupaten Bandung resmi dibentuk untuk mewadahi gerakan intelektual dan sosial kemasyarakatan di wilayah ini, membawa spirit perjuangan yang memadukan keislaman, keindonesiaan, dan kebangsaan.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-10 not-prose">
            {[
              { icon: BookOpen, title: 'Intelektual', desc: 'Tradisi membaca, diskusi, dan menulis menjadi fondasi gerakan.' },
              { icon: Users, title: 'Kerakyatan', desc: 'Selalu hadir mendampingi dan memberdayakan masyarakat akar rumput.' },
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-gray-50 dark:bg-gray-950 p-6 rounded-2xl border border-gray-100 dark:border-gray-800"
              >
                <item.icon size={24} className="text-primary-500 mb-3" />
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Star size={20} className="text-gold-500" />
            Fase Perkembangan
          </h3>
          <p>
            Dalam perjalanannya, PMII Kabupaten Bandung telah melewati berbagai fase kematangan berorganisasi. Mulai dari pembentukan komisariat-komisariat di berbagai kampus, penguatan kaderisasi (MAPABA, PKD, PKL), hingga keterlibatan aktif dalam merespons isu-isu sosial dan kebijakan publik di tingkat daerah.
          </p>

          <div className="bg-primary-50 dark:bg-primary-900/10 border-l-4 border-primary-500 p-6 rounded-r-2xl mt-8 italic text-gray-700 dark:text-gray-300">
            "Dzikir, Fikir, dan Amal Shaleh bukanlah sekadar semboyan, melainkan tarikan nafas dan gerak langkah setiap kader PMII dalam mendedikasikan dirinya untuk agama, bangsa, dan negara."
          </div>
        </div>

      </div>
    </div>
  );
}
