'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, FileText, Archive, Shield, BookOpen, Calendar,
  BarChart3, ArrowRight, Menu, X, Sun, Moon, ExternalLink,
  CheckCircle, Star, ChevronRight, MapPin, Phone, Mail,
  Download, HelpCircle, Newspaper, Image as ImageIcon, Award,
  Globe, Lock, Cpu, ChevronDown
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { mockBerita, mockAgenda } from '@/lib/mock-data';
import { formatDate, formatDateShort } from '@/lib/utils';


function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return <span ref={ref}>{count.toLocaleString('id-ID')}</span>;
}

const features = [
  { icon: Users, title: 'Database Kader', desc: 'Pengelolaan data kader terpusat dengan riwayat lengkap, KTA digital, dan jenjang kaderisasi terintegrasi.', color: 'from-green-500 to-emerald-600' },
  { icon: FileText, title: 'Manajemen Surat', desc: 'Surat masuk/keluar digital dengan nomor otomatis, tracking status, disposisi, dan QR Code verifikasi.', color: 'from-blue-500 to-cyan-600' },
  { icon: Archive, title: 'Arsip Digital', desc: 'Penyimpanan dan pengelolaan dokumen organisasi secara digital dengan versioning dan pencarian cepat.', color: 'from-purple-500 to-violet-600' },
  { icon: BookOpen, title: 'Sistem Kaderisasi', desc: 'Manajemen MAPABA, PKD, PKL dengan pendaftaran online, presensi QR, penilaian, dan sertifikat digital.', color: 'from-orange-500 to-amber-600' },
  { icon: Calendar, title: 'Agenda & Kalender', desc: 'Kalender kegiatan interaktif, pengingat otomatis, undangan digital, dan konfirmasi kehadiran online.', color: 'from-pink-500 to-rose-600' },
  { icon: BarChart3, title: 'Dashboard Analytics', desc: 'Statistik organisasi real-time dengan grafik pertumbuhan kader, surat, dan aktivitas kaderisasi.', color: 'from-teal-500 to-cyan-600' },
];

const strukturPengurus = [
  { jabatan: 'Ketua Umum', nama: 'H. Ahmad Zaenuri, S.Pd.', periode: '2024-2026' },
  { jabatan: 'Wakil Ketua Umum', nama: 'Muhammad Iqbal, S.H.', periode: '2024-2026' },
  { jabatan: 'Sekretaris Umum', nama: 'Siti Aisyah, S.Sos.', periode: '2024-2026' },
  { jabatan: 'Bendahara Umum', nama: 'Rizky Pratama, S.E.', periode: '2024-2026' },
];

const faqs = [
  { q: 'Apa itu E-SAHABAT?', a: 'E-SAHABAT adalah Sistem Administrasi, Hub Arsip, dan Basis Anggota Terpadu milik PC PMII Kabupaten Bandung untuk layanan digital organisasi.' },
  { q: 'Siapa yang dapat mengakses E-SAHABAT?', a: 'Seluruh anggota dan pengurus PMII Kabupaten Bandung dapat mengakses sistem ini sesuai hak akses masing-masing.' },
  { q: 'Bagaimana cara mendaftar sebagai anggota?', a: 'Klik tombol Daftar Anggota di halaman beranda, isi formulir pendaftaran, dan tunggu verifikasi dari pengurus.' },
  { q: 'Apakah data saya aman?', a: 'Ya. Sistem dilindungi dengan autentikasi JWT, enkripsi data, dan audit log untuk keamanan informasi.' },
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const [stats, setStats] = useState({
    totalKader: 0,
    totalKomisariat: 0,
    totalRayon: 0,
    suratKeluar: 0,
    arsipAktif: 0
  });

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const [beritas, setBeritas] = useState<any[]>([]);
  const [upcomingAgenda, setUpcomingAgenda] = useState<any[]>([]);
  
  useEffect(() => {
    fetch('/api/public/stats', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (!data.error) setStats(data);
      })
      .catch(console.error);

    fetch('/api/berita?published=true&limit=4', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setBeritas(data))
      .catch(err => console.error(err));

    fetch('/api/agenda?upcoming=true&limit=4', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setUpcomingAgenda(data))
      .catch(err => console.error(err));
  }, []);

  const featuredBerita = beritas.length > 0 ? beritas[0] : null;
  const otherBerita = beritas.slice(1, 4);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 animated-gradient bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        {/* Floating decorative elements */}
        <div className="absolute top-32 right-16 w-64 h-64 bg-gold-400/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-32 left-16 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

        <div className="relative container-lg pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full text-white/90 text-sm font-medium mb-6">
                <div className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
                PC PMII Kabupaten Bandung
              </div>

              {/* Logo PMII + Title */}
              <div className="mb-8 relative block w-fit group">
                <div className="absolute -inset-1 bg-gradient-to-r from-gold-400 to-primary-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative bg-white/95 backdrop-blur-sm p-4 px-6 rounded-2xl shadow-2xl border border-white/50 transform group-hover:-translate-y-1 transition-all duration-300">
                  <img src="/logo-wide.png" alt="E-Sahabat Logo" className="h-14 lg:h-16 w-auto object-contain drop-shadow-sm" />
                </div>
              </div>

              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight mb-4">
                <span className="gold-gradient-text">E-SAHABAT</span>
                <br />
                <span className="text-white/95 text-3xl lg:text-4xl font-bold leading-tight">
                  Sistem Administrasi<br />Digital PMII
                </span>
              </h1>

              <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-lg">
                Pusat layanan digital PC PMII Kabupaten Bandung — administrasi organisasi, arsip digital, database kader, dan kaderisasi dalam satu platform terpadu.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link href="/login" className="btn-gold text-base px-6 py-3 shadow-xl shadow-gold-500/30">
                  <Lock size={18} /> Masuk Sistem
                </Link>
                <Link href="/register" className="btn-outline border-white/50 text-white hover:bg-white hover:text-primary-700 text-base px-6 py-3">
                  <Users size={18} /> Daftar Anggota
                </Link>
                <Link href="#tentang" className="btn-ghost text-white/80 hover:bg-white/10 text-base px-6 py-3">
                  Jelajahi <ArrowRight size={16} />
                </Link>
              </div>

              {/* Quick stats */}
              <div className="flex gap-6 mt-10 pt-8 border-t border-white/20">
                {[
                  { value: stats.totalKader, label: 'Kader Aktif' },
                  { value: stats.totalKomisariat, label: 'Komisariat' },
                  { value: stats.totalRayon, label: 'Rayon' },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-2xl font-black text-white">
                      <AnimatedCounter target={s.value} />+
                    </div>
                    <div className="text-sm text-white/60">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Main card */}
                <div className="glass rounded-3xl p-6 shadow-2xl animate-float">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <div className="text-white font-bold text-lg">Dashboard E-SAHABAT</div>
                      <div className="text-white/60 text-sm">PC PMII Kab. Bandung</div>
                    </div>
                    <div className="w-10 h-10 bg-gold-400/20 rounded-xl flex items-center justify-center">
                      <BarChart3 size={20} className="text-gold-300" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {[
                      { label: 'Total Kader', value: stats.totalKader, icon: Users, color: 'bg-green-400/20', textColor: 'text-green-300' },
                      { label: 'Komisariat', value: stats.totalKomisariat, icon: Globe, textColor: 'text-blue-300', color: 'bg-blue-400/20' },
                      { label: 'Surat Keluar', value: stats.suratKeluar, icon: FileText, color: 'bg-purple-400/20', textColor: 'text-purple-300' },
                      { label: 'Arsip', value: stats.arsipAktif, icon: Archive, color: 'bg-orange-400/20', textColor: 'text-orange-300' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="bg-white/10 rounded-xl p-3"
                      >
                        <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center mb-2`}>
                          <item.icon size={16} className={item.textColor} />
                        </div>
                        <div className="text-white font-bold text-lg">{item.value}</div>
                        <div className="text-white/60 text-xs">{item.label}</div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Progress bars */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs text-white/70 mb-1">
                        <span>Kaderisasi MAPABA</span><span>92%</span>
                      </div>
                      <div className="h-1.5 bg-white/20 rounded-full">
                        <motion.div className="h-full bg-gold-400 rounded-full" initial={{ width: 0 }} animate={{ width: '92%' }} transition={{ delay: 1, duration: 1 }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-white/70 mb-1">
                        <span>Arsip Digital</span><span>87%</span>
                      </div>
                      <div className="h-1.5 bg-white/20 rounded-full">
                        <motion.div className="h-full bg-green-400 rounded-full" initial={{ width: 0 }} animate={{ width: '87%' }} transition={{ delay: 1.2, duration: 1 }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-white/70 mb-1">
                        <span>KTA Aktif</span><span>78%</span>
                      </div>
                      <div className="h-1.5 bg-white/20 rounded-full">
                        <motion.div className="h-full bg-blue-400 rounded-full" initial={{ width: 0 }} animate={{ width: '78%' }} transition={{ delay: 1.4, duration: 1 }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -top-4 -right-4 glass rounded-xl px-3 py-2 border border-white/20"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-white text-xs font-medium">Sistem Online</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="absolute -bottom-4 -left-4 glass rounded-xl px-3 py-2 border border-white/20"
                >
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-gold-300" />
                    <span className="text-white text-xs font-medium">Terenkripsi & Aman</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="text-white/50 text-xs">Scroll</div>
          <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center pt-1">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* TENTANG SISTEM */}
      <section id="tentang" className="section bg-gray-50 dark:bg-gray-900">
        <div className="container-lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium mb-4">
              <Star size={14} className="text-gold-500" />
              Tentang Sistem
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-4">
              Apa itu <span className="gradient-text">E-SAHABAT?</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              E-SAHABAT merupakan Sistem Administrasi, Hub Arsip, dan Basis Anggota Terpadu yang dikembangkan sebagai pusat layanan digital PC PMII Kabupaten Bandung dalam mengintegrasikan administrasi organisasi, pengelolaan arsip, basis data kader, serta proses kaderisasi secara efektif, transparan, dan berkelanjutan.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Cpu, title: 'Sistem Terpadu', desc: 'Seluruh administrasi organisasi terintegrasi dalam satu platform digital yang mudah diakses kapan saja dan di mana saja.' },
              { icon: Shield, title: 'Aman & Terpercaya', desc: 'Data organisasi dilindungi dengan autentikasi JWT, enkripsi, dan audit log untuk keamanan informasi yang optimal.' },
              { icon: Globe, title: 'Akses Fleksibel', desc: 'Tersedia di semua perangkat, baik desktop maupun mobile, dengan antarmuka yang responsif dan mudah digunakan.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card p-6 text-center hover:shadow-card-hover"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <item.icon size={24} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FITUR UNGGULAN */}
      <section className="section bg-white dark:bg-gray-950">
        <div className="container-lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-50 dark:bg-gold-900/20 text-gold-600 dark:text-gold-400 rounded-full text-sm font-medium mb-4">
              <Award size={14} />
              Fitur Lengkap
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-4">
              Semua Kebutuhan Organisasi<br /><span className="gradient-text">dalam Satu Platform</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Dirancang khusus untuk kebutuhan administrasi dan kaderisasi PMII</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:shadow-primary-500/10 hover:border-primary-200 dark:hover:border-primary-800/50 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feat.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <feat.icon size={22} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{feat.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATISTIK */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 animated-gradient bg-gradient-to-r from-primary-600 to-primary-800" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="relative container-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-black text-white mb-2">PC PMII Kabupaten Bandung dalam Angka</h2>
            <p className="text-white/70">Data real-time organisasi kami</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: stats.totalKader, label: 'Total Kader', icon: Users },
              { value: stats.totalKomisariat, label: 'Komisariat', icon: Globe },
              { value: stats.totalRayon, label: 'Rayon', icon: MapPin },
              { value: stats.arsipAktif, label: 'Arsip Digital', icon: Archive },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon size={22} className="text-gold-300" />
                </div>
                <div className="text-4xl font-black text-white mb-1">
                  <AnimatedCounter target={stat.value} />
                  {stat.value > 100 ? '+' : ''}
                </div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BERITA TERKINI */}
      <section className="section bg-gray-50 dark:bg-gray-900">
        <div className="container-lg">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-xs font-medium mb-3">
                <Newspaper size={12} />
                Berita Terkini
              </div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                Kabar & <span className="gradient-text">Informasi Terbaru</span>
              </h2>
            </div>
            <Link href="/publikasi/berita" className="btn-outline btn-sm hidden sm:inline-flex">
              Semua Berita <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {featuredBerita && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-2 card overflow-hidden group"
              >
                <div className="relative h-52 bg-gradient-to-br from-primary-500 to-primary-700 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div className="absolute top-3 left-3 z-20 badge badge-gold">⭐ Featured</div>
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <span className="badge badge-green text-xs mb-2">{featuredBerita.kategori}</span>
                    <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">{featuredBerita.judul}</h3>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <Newspaper size={80} className="text-white" />
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">{featuredBerita.ringkasan}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">{formatDate(featuredBerita.createdAt)} · {featuredBerita.viewCount} views</div>
                    <Link href={`/berita/${featuredBerita.slug}`} className="btn-primary btn-sm text-xs py-1.5 px-3">Baca <ChevronRight size={12} /></Link>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="space-y-4">
              {otherBerita.map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card p-4 flex gap-3 items-start group hover:border-primary-200 dark:hover:border-primary-800"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Newspaper size={18} className="text-primary-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="badge badge-blue text-xs mb-1">{b.kategori}</span>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight line-clamp-2 group-hover:text-primary-600 transition-colors">{b.judul}</h4>
                    <div className="text-xs text-gray-400 mt-1">{formatDateShort(b.createdAt)}</div>
                  </div>
                </motion.div>
              ))}
              <Link href="/publikasi/berita" className="btn-outline w-full justify-center text-sm">Lihat Semua Berita</Link>
            </div>
          </div>
        </div>
      </section>

      {/* AGENDA TERDEKAT */}
      <section className="section bg-white dark:bg-gray-950">
        <div className="container-lg">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-50 dark:bg-gold-900/20 text-gold-600 dark:text-gold-400 rounded-full text-xs font-medium mb-3">
                <Calendar size={12} />
                Agenda
              </div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                Kegiatan <span className="gradient-text">Mendatang</span>
              </h2>
            </div>
            <Link href="/publikasi/agenda" className="btn-outline btn-sm hidden sm:inline-flex">
              Semua Agenda <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {upcomingAgenda.length === 0 ? (
              <div className="col-span-2 text-center py-10 border border-dashed rounded-2xl border-gray-200 dark:border-gray-800 text-gray-400">Belum ada kegiatan/agenda terdekat.</div>
            ) : upcomingAgenda.map((agenda, i) => (
              <motion.div
                key={agenda.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-5 flex gap-4 items-start hover:border-primary-200 dark:hover:border-primary-800"
              >
                <div className="flex-shrink-0 text-center bg-primary-500 text-white rounded-xl p-3 min-w-[56px]">
                  <div className="text-xl font-black leading-none">{new Date(agenda.waktuPelaksanaan).getDate()}</div>
                  <div className="text-[10px] mt-1 opacity-80">{new Date(agenda.waktuPelaksanaan).toLocaleDateString('id-ID', { month: 'short' })}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-blue text-[10px] px-2 py-0.5">{agenda.kategori}</span>
                    <span className="badge badge-green text-[10px] px-2 py-0.5">{agenda.status}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1.5 line-clamp-2 leading-tight">{agenda.judul}</h4>
                  <div className="flex items-center gap-3 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1"><Calendar size={12} />{new Date(agenda.waktuPelaksanaan).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})} WIB</span>
                    <span className="flex items-center gap-1 truncate"><MapPin size={12} />{agenda.lokasi}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROFIL PENGURUS */}
      <section className="section bg-gray-50 dark:bg-gray-900">
        <div className="container-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
              Pimpinan <span className="gradient-text">PC PMII Kabupaten Bandung</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Periode 2024-2026</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {strukturPengurus.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-5 text-center hover:shadow-card-hover"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg">
                  <Users size={24} className="text-white" />
                </div>
                <div className="font-bold text-gray-900 dark:text-white text-sm mb-0.5">{p.nama}</div>
                <div className="text-primary-500 text-xs font-medium mb-1">{p.jabatan}</div>
                <div className="text-gray-400 text-xs">{p.periode}</div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/profil/struktur" className="btn-outline inline-flex">
              Lihat Struktur Lengkap <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-white dark:bg-gray-950">
        <div className="container-lg max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 rounded-full text-xs font-medium mb-4">
              <HelpCircle size={12} />
              FAQ
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">
              Pertanyaan yang <span className="gradient-text">Sering Diajukan</span>
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">{faq.q}</span>
                  <ChevronDown size={16} className={`text-primary-500 flex-shrink-0 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/20 rounded-full blur-3xl" />
        <div className="relative container-lg text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 bg-white/15 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Users size={32} className="text-gold-300" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
              Bergabunglah dengan<br />
              <span className="gold-gradient-text">Keluarga Besar PMII</span>
            </h2>
            <p className="text-white/75 text-lg mb-8 max-w-xl mx-auto">
              Jadilah bagian dari gerakan mahasiswa yang progresif, intelektual, dan berakhlak. Daftarkan dirimu sekarang!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/register" className="btn-gold text-base px-8 py-3 shadow-xl">
                <Users size={18} /> Daftar Anggota Sekarang
              </Link>
              <Link href="/login" className="btn-outline border-white/50 text-white hover:bg-white hover:text-primary-700 text-base px-8 py-3">
                <Lock size={18} /> Login ke Sistem
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
