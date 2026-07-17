'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users, FileText, Archive, BookOpen, Calendar, Bell, TrendingUp,
  ChevronRight, ArrowUpRight, Clock, MapPin, Star, CheckCircle,
  AlertCircle, Info, Building2, Package, BarChart3, Newspaper, Plus
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { formatDate, formatDateShort, getStatusColor } from '@/lib/utils';
import { cn } from '@/lib/utils';

function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{count.toLocaleString('id-ID')}</>;
}

const getStatCards = (stats: any) => [
  {
    title: 'Total Kader',
    value: stats?.totalKader || 0,
    icon: Users,
    color: 'from-primary-500 to-primary-700',
    shadow: 'shadow-primary-500/20',
    change: 'Total Terdaftar',
    trend: 'neutral',
    href: '/dashboard/kader',
  },
  {
    title: 'Komisariat',
    value: stats?.komisariat || 0,
    icon: Building2,
    color: 'from-blue-500 to-blue-700',
    shadow: 'shadow-blue-500/20',
    change: 'Aktif',
    trend: 'neutral',
    href: '/dashboard/kader',
  },
  {
    title: 'Rayon',
    value: stats?.rayon || 0,
    icon: Star,
    color: 'from-indigo-500 to-indigo-700',
    shadow: 'shadow-indigo-500/20',
    change: 'Aktif',
    trend: 'neutral',
    href: '/dashboard/kader',
  },
  {
    title: 'Surat Masuk',
    value: stats?.suratMasuk || 0,
    icon: FileText,
    color: 'from-orange-500 to-orange-700',
    shadow: 'shadow-orange-500/20',
    change: 'Tercatat',
    trend: 'neutral',
    href: '/dashboard/surat/masuk',
  },
  {
    title: 'Surat Keluar',
    value: stats?.suratKeluar || 0,
    icon: FileText,
    color: 'from-purple-500 to-purple-700',
    shadow: 'shadow-purple-500/20',
    change: 'Diterbitkan',
    trend: 'neutral',
    href: '/dashboard/surat/keluar',
  },
  {
    title: 'Arsip Digital',
    value: stats?.arsip || 0,
    icon: Archive,
    color: 'from-teal-500 to-teal-700',
    shadow: 'shadow-teal-500/20',
    change: 'Total Dokumen',
    trend: 'neutral',
    href: '/dashboard/surat/arsip',
  },
  {
    title: 'Arsip Tahun Ini',
    value: stats?.arsipTahunIni || 0,
    icon: Archive,
    color: 'from-cyan-500 to-cyan-700',
    shadow: 'shadow-cyan-500/20',
    change: new Date().getFullYear().toString(),
    trend: 'neutral',
    href: '/dashboard/surat/arsip',
  },
  {
    title: 'Pengajuan Surat',
    value: stats?.pengajuanSurat || 0,
    icon: Clock,
    color: 'from-amber-500 to-amber-700',
    shadow: 'shadow-amber-500/20',
    change: 'Menunggu proses',
    trend: stats?.pengajuanSurat ? 'alert' : 'neutral',
    href: '/dashboard/surat/tinjauan-surat',
  },
];



export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const [upcomingAgenda, setUpcomingAgenda] = useState<any[]>([]);
  const [myPengajuan, setMyPengajuan] = useState<{surat: any[], sk: any[]}>({ surat: [], sk: [] });
  const [realStats, setRealStats] = useState<any>(null);
  const [recentPengajuan, setRecentPengajuan] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/dashboard', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.stats) setRealStats(data.stats);
        if (data.recentPengajuan) setRecentPengajuan(data.recentPengajuan);
      })
      .catch(console.error);
    fetch('/api/agenda?upcoming=true&limit=5', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setUpcomingAgenda(data))
      .catch(console.error);

    if (user?.role === 'ANGGOTA' || user?.role === 'KETUA_KOMISARIAT' || user?.role === 'SEKRETARIS_KOMISARIAT' || user?.role === 'KETUA_RAYON' || user?.role === 'SEKRETARIS_RAYON') {
      fetch('/api/user/pengajuan', { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (data && data.surat && data.sk) {
            setMyPengajuan(data);
          }
        })
        .catch(console.error);
    }
  }, [user]);

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN_CABANG';

  // Generate notifikasi secara realtime berdasarkan status database
  const unreadNotif = [];
  
  if (isAdmin) {
    if (realStats?.pengajuanSurat > 0) {
      unreadNotif.push({
        id: '1',
        pesan: `Ada ${realStats.pengajuanSurat} pengajuan surat menunggu tinjauan.`
      });
    }
  } else {
    const pendingSurat = myPengajuan?.surat?.filter(s => s.status === 'PENDING')?.length || 0;
    const pendingSK = myPengajuan?.sk?.filter(s => s.status === 'PENDING')?.length || 0;
    
    if (pendingSurat > 0) {
      unreadNotif.push({ id: 's1', pesan: `Anda memiliki ${pendingSurat} pengajuan surat yang sedang diproses.` });
    }
    if (pendingSK > 0) {
      unreadNotif.push({ id: 'k1', pesan: `Anda memiliki ${pendingSK} pengajuan SK yang sedang diproses.` });
    }
  }

  const pendingSurat = myPengajuan?.surat?.filter(s => s.status === 'PENDING')?.length || 0;
  const pendingSK = myPengajuan?.sk?.filter(s => s.status === 'PENDING')?.length || 0;
  const totalSurat = myPengajuan?.surat?.length || 0;
  const totalSK = myPengajuan?.sk?.length || 0;

  const userStatCards = [
    {
      title: 'Surat Diajukan',
      value: totalSurat,
      icon: FileText,
      color: 'from-blue-500 to-blue-700',
      shadow: 'shadow-blue-500/20',
      change: pendingSurat + ' menunggu',
      trend: 'neutral',
      href: '/dashboard/pengajuan/surat',
    },
    {
      title: 'SK Diajukan',
      value: totalSK,
      icon: BookOpen,
      color: 'from-indigo-500 to-indigo-700',
      shadow: 'shadow-indigo-500/20',
      change: pendingSK + ' menunggu',
      trend: 'neutral',
      href: '/dashboard/pengajuan/sk',
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            Selamat datang, <span className="gradient-text">{user?.name?.split(' ')[0]}! 👋</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

      </div>

      {/* Alert Banner */}
      {unreadNotif.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl"
        >
          <div className="flex items-center gap-3 flex-1">
            <Bell size={18} className="text-blue-500 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-sm text-blue-700 dark:text-blue-300">
                Anda memiliki <strong>{unreadNotif.length} notifikasi aktif</strong>.
              </span>
              <span className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                {unreadNotif.map(n => n.pesan).join(' ')}
              </span>
            </div>
          </div>
          {isAdmin && (
            <Link href="/dashboard/surat/tinjauan-surat" className="text-xs text-blue-500 font-semibold hover:text-blue-700 flex items-center gap-1 shrink-0">
              Tinjau Sekarang <ChevronRight size={12} />
            </Link>
          )}
        </motion.div>
      )}

      {/* Stat Cards Grid */}
      <div className={cn("grid gap-4", isAdmin ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2 md:grid-cols-2 lg:grid-cols-4")}>
        {(isAdmin ? getStatCards(realStats) : userStatCards).map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={card.href} className="stat-card hover:shadow-lg group block">
              <div className="flex items-start justify-between">
                <div className={cn(
                  'w-11 h-11 bg-gradient-to-br rounded-xl flex items-center justify-center shadow-lg flex-shrink-0',
                  card.color, card.shadow
                )}>
                  <card.icon size={20} className="text-white" />
                </div>
                <ArrowUpRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-primary-500 transition-colors" />
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">
                  <AnimatedCounter target={card.value} />
                </div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{card.title}</div>
                <div className={cn(
                  'text-xs font-medium flex items-center gap-1',
                  card.trend === 'up' ? 'text-green-500' :
                  card.trend === 'alert' ? 'text-amber-500' :
                  'text-gray-400'
                )}>
                  {card.trend === 'up' && <TrendingUp size={10} />}
                  {card.trend === 'alert' && <AlertCircle size={10} />}
                  {card.change}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>



      {/* Bottom Row: Agenda + Recent Surat */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Agenda Terdekat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Agenda Terdekat</h3>
            <Link href="/dashboard/agenda" className="text-xs text-primary-500 hover:text-primary-700 font-medium flex items-center gap-1">
              Semua <ChevronRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingAgenda.map((agenda) => (
              <div key={agenda.id} className="flex gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-500 text-white rounded-xl flex flex-col items-center justify-center">
                  <div className="text-sm font-black leading-none">{new Date(agenda.waktuPelaksanaan).getDate()}</div>
                  <div className="text-[10px] opacity-80 leading-none">{new Date(agenda.waktuPelaksanaan).toLocaleDateString('id-ID', { month: 'short' })}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white text-xs leading-snug line-clamp-1">{agenda.judul}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={10} />{new Date(agenda.waktuPelaksanaan).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1 truncate"><MapPin size={10} />{agenda.lokasi}</span>
                  </div>
                </div>
                <div className="badge badge-blue text-[10px] whitespace-nowrap self-start">{agenda.kategori}</div>
              </div>
            ))}
            {upcomingAgenda.length === 0 && (
              <div className="text-xs text-center text-gray-400 py-5">Tidak ada agenda mendatang.</div>
            )}
          </div>
        </motion.div>

        {/* Riwayat Pengajuan Pribadi (Bagi Kader) */}
        {(user?.role === 'ANGGOTA' || user?.role === 'KETUA_KOMISARIAT' || user?.role === 'SEKRETARIS_KOMISARIAT' || user?.role === 'KETUA_RAYON' || user?.role === 'SEKRETARIS_RAYON') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="card p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Riwayat Pengajuan Anda</h3>
              <Link href="/dashboard/pengajuan/surat" className="text-xs text-primary-500 hover:text-primary-700 font-medium flex items-center gap-1">
                Baru <Plus size={12} />
              </Link>
            </div>
            <div className="space-y-3">
              {myPengajuan?.surat?.slice(0, 3).map((s: any) => (
                <div key={s.id} className="flex flex-col p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1">{s.perihal}</div>
                    <span className={cn('badge text-[10px]', getStatusColor(s.status))}>{s.status}</span>
                  </div>
                  <div className="text-[10px] text-gray-500 flex justify-between">
                    <span>Resi: {s.nomorResi}</span>
                    <span>{new Date(s.createdAt).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
              ))}
              {myPengajuan?.sk?.slice(0, 2).map((s: any) => (
                <div key={s.id} className="flex flex-col p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1">SK {s.namaStruktur}</div>
                    <span className={cn('badge text-[10px]', getStatusColor(s.status))}>{s.status}</span>
                  </div>
                  <div className="text-[10px] text-gray-500 flex justify-between">
                    <span>Resi: {s.nomorResi}</span>
                    <span>{new Date(s.createdAt).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
              ))}
              {(!myPengajuan?.surat?.length && !myPengajuan?.sk?.length) && (
                <div className="text-xs text-center text-gray-400 py-4">Belum ada riwayat pengajuan.</div>
              )}
            </div>
          </motion.div>
        )}

        {/* Tinjauan Surat (Khusus Admin PC) */}
        {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN_CABANG') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="card p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Menunggu Tinjauan</h3>
              <Link href="/dashboard/surat/tinjauan-surat" className="text-xs text-primary-500 hover:text-primary-700 font-medium flex items-center gap-1">
                Semua <ChevronRight size={12} />
              </Link>
            </div>
            <div className="space-y-2">
              {recentPengajuan.map((surat) => (
                <div key={surat.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:bg-gray-800 transition-colors">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-amber-100 dark:bg-amber-900/30">
                    <FileText size={15} className="text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-900 dark:text-white line-clamp-1">{surat.perihal}</div>
                    <div className="text-xs text-gray-400 mt-0.5">Pemohon: {surat.namaPemohon}</div>
                  </div>
                  <span className={cn('badge text-xs', getStatusColor(surat.status))}>{surat.status}</span>
                </div>
              ))}
              {recentPengajuan.length === 0 && (
                <div className="text-xs text-center text-gray-400 py-4">Belum ada pengajuan baru.</div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card p-5"
      >
        <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4">Akses Cepat</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN_CABANG') ? (
            [
              { href: '/dashboard/kader', label: 'Tambah Kader', icon: Users, color: 'text-primary-500 bg-primary-50 dark:bg-primary-900/20' },
              { href: '/dashboard/surat/arsip', label: 'Buku Besar Surat', icon: FileText, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
              { href: '/dashboard/berita', label: 'Tulis Berita', icon: Newspaper, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
              { href: '/dashboard/surat/tinjauan-surat', label: 'Tinjau Pengajuan', icon: CheckCircle, color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' },
              { href: '/dashboard/agenda', label: 'Buat Agenda', icon: Calendar, color: 'text-teal-500 bg-teal-50 dark:bg-teal-900/20' },
            ].map((item, i) => (
              <Link key={i} href={item.href} className="flex flex-col items-center gap-2 p-4 rounded-xl hover:shadow-md transition-all group">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform', item.color)}>
                  <item.icon size={20} />
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center leading-tight">{item.label}</span>
              </Link>
            ))
          ) : (
            [
              { href: '/dashboard/pengajuan/surat', label: 'Ajukan Surat', icon: FileText, color: 'text-primary-500 bg-primary-50 dark:bg-primary-900/20' },
              { href: '/dashboard/pengajuan/sk', label: 'Ajukan SK', icon: BookOpen, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
              { href: '/dashboard/kaderisasi/screening', label: 'Daftar Screening', icon: CheckCircle, color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
              { href: '/dashboard/kaderisasi/presensi', label: 'Presensi Mapaba', icon: Users, color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' },
            ].map((item, i) => (
              <Link key={i} href={item.href} className="flex flex-col items-center gap-2 p-4 rounded-xl hover:shadow-md transition-all group">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform', item.color)}>
                  <item.icon size={20} />
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center leading-tight">{item.label}</span>
              </Link>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
