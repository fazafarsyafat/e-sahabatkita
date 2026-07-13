'use client';

import { motion } from 'framer-motion';
import { Scale, MessageCircle, Shield, FileText, CheckCircle2, ChevronRight, Gavel, BookOpen, AlertCircle, ArrowRight } from 'lucide-react';

export default function KonsultasiHukumPage() {
  const waNumber = '6287831505290';
  const waMessage = 'Halo LBH PC PMII Kabupaten Bandung, saya ingin melakukan konsultasi hukum...';
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  // Animation variants
  const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 overflow-hidden pt-24 pb-20 relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[40%] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container-lg relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-20 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white mb-8 shadow-2xl shadow-blue-500/30 relative"
          >
            <div className="absolute inset-0 bg-white/20 rounded-3xl blur-md opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            <Scale size={48} className="relative z-10" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 dark:from-white dark:via-blue-200 dark:to-white mb-6 leading-[1.2]"
          >
            Lembaga Bantuan Hukum <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">PC PMII Kabupaten Bandung</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto"
          >
            Lembaga Semi Otonom (LSO) yang berdedikasi memberikan pendampingan, advokasi, dan layanan konsultasi hukum bagi kader PMII dan masyarakat luas demi tegaknya keadilan.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Kolom Kiri: Tentang & Layanan (Makan 7 Kolom) */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-7 space-y-8"
          >
            {/* Card Tentang */}
            <motion.div variants={fadeIn} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-black/20 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                  <Shield size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Tentang LBH PMII</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                LBH PC PMII Kabupaten Bandung lahir sebagai bentuk manifestasi nilai-nilai pergerakan dalam ranah hukum. Kami meyakini bahwa hukum harus menjadi panglima yang melindungi hak-hak setiap warga negara, bukan menjadi alat penindas bagi yang lemah.
              </p>
            </motion.div>

            {/* Grid Layanan */}
            <motion.div variants={fadeIn}>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Gavel className="text-indigo-500" /> Fokus Layanan Kami
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: MessageCircle, title: 'Konsultasi Pro Bono', desc: 'Layanan konsultasi hukum gratis bagi masyarakat kurang mampu.' },
                  { icon: Shield, title: 'Pendampingan Litigasi', desc: 'Pendampingan hukum di dalam maupun di luar pengadilan.' },
                  { icon: FileText, title: 'Advokasi Kebijakan', desc: 'Pengawalan dan kritisi terhadap kebijakan publik.' },
                  { icon: BookOpen, title: 'Literasi Hukum', desc: 'Penyuluhan untuk meningkatkan kesadaran hukum.' }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 group cursor-default"
                  >
                    <item.icon size={28} className="text-blue-500 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                    <h5 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Kolom Kanan: Card Aksi (Makan 5 Kolom) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-5 sticky top-28"
          >
            {/* Card Konsultasi Utama */}
            <div className="relative group">
              {/* Animated Border Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              
              <div className="relative bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden">
                {/* Decorative background shape */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-500/10 dark:bg-green-400/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-green-500/30 transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                  <MessageCircle size={32} />
                </div>
                
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
                  Butuh Bantuan <br/>Hukum Segera?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-10 leading-relaxed text-lg">
                  Tim paralegal dan advokat LBH PMII siap mendengarkan dan membantu Anda. Konsultasikan sekarang, **gratis dan rahasia terjamin**.
                </p>

                <div className="space-y-4 relative z-10">
                  <a 
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-1 rounded-2xl font-bold shadow-xl shadow-green-500/25 transition-all hover:scale-[1.02] active:scale-95 group/btn"
                  >
                    <span className="flex items-center gap-3 pl-5 py-4">
                      <MessageCircle size={22} className="animate-pulse" />
                      Konsultasi via WhatsApp
                    </span>
                    <span className="bg-white/20 p-4 rounded-xl group-hover/btn:bg-white/30 transition-colors">
                      <ArrowRight size={20} />
                    </span>
                  </a>
                  
                  <div className="text-center pt-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Atau hubungi nomor telepon:</span>
                    <div className="font-mono text-lg font-bold text-gray-900 dark:text-white mt-1">0878-3150-5290</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200/60 dark:border-amber-700/30 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-500">
                <AlertCircle size={20} />
              </div>
              <div>
                <h5 className="font-bold text-amber-900 dark:text-amber-500 mb-1">Persiapan Konsultasi</h5>
                <p className="text-sm text-amber-800/80 dark:text-amber-400/80 leading-relaxed">
                  Siapkan kronologi kejadian secara berurutan dan dokumen bukti pendukung agar tim advokat kami dapat menganalisis kasus Anda dengan cepat.
                </p>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </div>
  );
}
