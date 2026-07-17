'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  LayoutDashboard, Users, FileText, Archive, BookOpen, Calendar,
  Newspaper, Package, BarChart3, Settings, LogOut, Menu, X, Bell,
  Search, Sun, Moon, ChevronRight, Shield, User, Home,
  Building2, Boxes, TrendingUp, ChevronDown, Box
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { getRoleLabel, getRoleColor, formatDateTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  roles?: string[];
  children?: { href: string; label: string }[];
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }, // Accessible by ALL
  
  // ================= ADMIN & PENGURUS =================
  { href: '/dashboard/kader', label: 'Database Kader', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN_CABANG', 'KETUA_KOMISARIAT', 'SEKRETARIS_KOMISARIAT'] },
  {
    href: '/dashboard/surat/arsip', label: 'Administrasi Surat', icon: FileText,
    children: [
      { href: '/dashboard/surat/tinjauan-sk', label: 'Tinjauan SK' },
      { href: '/dashboard/surat/tinjauan-surat', label: 'Tinjauan Surat' },
      { href: '/dashboard/surat/arsip', label: 'Arsip Persuratan' },
    ],
    roles: ['SUPER_ADMIN', 'ADMIN_CABANG'] // Hanya PC yang meninjau & mengarsip
  },
  { href: '/dashboard/berita', label: 'Berita & Pengumuman', icon: Newspaper, roles: ['SUPER_ADMIN', 'ADMIN_CABANG'] },
  { href: '/dashboard/pengurus', label: 'Struktur Pengurus', icon: Building2, roles: ['SUPER_ADMIN', 'ADMIN_CABANG'] },

  // ================= USER / KADER BIASA =================
  {
    href: '/dashboard/pengajuan', label: 'Borang Pengajuan', icon: FileText,
    children: [
      { href: '/dashboard/pengajuan/sk', label: 'Pengajuan SK' },
      { href: '/dashboard/pengajuan/surat', label: 'Pengajuan Surat' },
    ],
    roles: ['ANGGOTA', 'KETUA_KOMISARIAT', 'SEKRETARIS_KOMISARIAT', 'KETUA_RAYON', 'SEKRETARIS_RAYON'] // Semua user bisa mengajukan
  },
  {
    href: '/dashboard/kaderisasi', label: 'Manajemen Kaderisasi', icon: BookOpen,
    roles: ['SUPER_ADMIN', 'ADMIN_CABANG', 'KETUA_KOMISARIAT', 'SEKRETARIS_KOMISARIAT'] // Hanya Admin yang bisa mengelola
  },
  {
    href: '/dashboard/kaderisasi-ku', label: 'Kaderisasi Saya', icon: BookOpen,
    roles: ['ANGGOTA', 'KETUA_KOMISARIAT', 'SEKRETARIS_KOMISARIAT', 'KETUA_RAYON', 'SEKRETARIS_RAYON'] // Dasbor internal untuk daftar & presensi
  },
  { href: '/dashboard/agenda', label: 'Agenda', icon: Calendar },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: session, status } = useSession();
  const user = session?.user as any;
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    toast.success('Berhasil logout');
    await signOut({ callbackUrl: '/login' });
  };

  const toggleExpand = (href: string) => {
    setExpandedItems(prev =>
      prev.includes(href) ? prev.filter(h => h !== href) : [...prev, href]
    );
  };

  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchNotif = async () => {
      try {
        const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN_CABANG';
        if (isAdmin) {
          const res = await fetch('/api/dashboard', { cache: 'no-store' });
          const data = await res.json();
          const notifs = [];
          if (data?.stats?.pengajuanSurat > 0) {
             notifs.push({
               id: '1',
               judul: 'Tinjauan Surat',
               pesan: `Ada ${data.stats.pengajuanSurat} pengajuan surat menunggu tinjauan dari kader.`,
               jenis: 'info',
               dibaca: false,
               createdAt: new Date().toISOString()
             });
          }
          setNotifications(notifs);
        } else {
          const res = await fetch('/api/user/pengajuan', { cache: 'no-store' });
          const data = await res.json();
          const notifs = [];
          const pendingSurat = data?.surat?.filter((s: any) => s.status === 'PENDING')?.length || 0;
          const pendingSK = data?.sk?.filter((s: any) => s.status === 'PENDING')?.length || 0;
          
          if (pendingSurat > 0) {
            notifs.push({
              id: 's1',
              judul: 'Pengajuan Surat',
              pesan: `Ada ${pendingSurat} pengajuan surat Anda yang masih diproses.`,
              jenis: 'warning',
              dibaca: false,
              createdAt: new Date().toISOString()
            });
          }
          if (pendingSK > 0) {
            notifs.push({
              id: 'k1',
              judul: 'Pengajuan SK',
              pesan: `Ada ${pendingSK} pengajuan SK Anda yang masih diproses.`,
              jenis: 'warning',
              dibaca: false,
              createdAt: new Date().toISOString()
            });
          }
          setNotifications(notifs);
        }
      } catch (e) { console.error(e); }
    };
    fetchNotif();
    
    // Auto-refresh notifications every 30 seconds
    const interval = setInterval(fetchNotif, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.dibaca).length;

  const filteredNav = navItems.filter(item => {
    if (!item.roles) return true;
    if (!user) return false;
    const userRole = (user.role || '').toUpperCase();
    return item.roles.map(r => r.toUpperCase()).includes(userRole);
  });

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-center p-5 border-b border-gray-100 dark:border-gray-800 h-[76px]">
        {sidebarOpen ? (
          <img src="/logo-wide.png" alt="E-Sahabat" className="max-h-12 w-auto object-contain dark:brightness-0 dark:invert" />
        ) : (
          <img src="/logo-square.png" alt="E-Sahabat" className="w-9 h-9 object-contain dark:brightness-0 dark:invert" />
        )}
      </div>

      {/* User Card */}
      {sidebarOpen && user && (
        <div className="m-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=007A33&color=fff`}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-gray-900 dark:text-white text-sm truncate">{user.name}</div>
              <div className={cn('badge text-xs mt-0.5', getRoleColor((user.role || '').toLowerCase() as any))}>
                {getRoleLabel((user.role || '').toLowerCase() as any)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {filteredNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const isExpanded = expandedItems.includes(item.href);
          const hasChildren = item.children && item.children.length > 0;

          return (
            <div key={item.href}>
              <div
                className={cn(
                  'sidebar-link cursor-pointer justify-between',
                  isActive && !hasChildren && 'active'
                )}
                onClick={() => {
                  if (hasChildren) {
                    toggleExpand(item.href);
                  } else {
                    router.push(item.href);
                    setMobileSidebarOpen(false);
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className="flex-shrink-0" />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </div>
                {sidebarOpen && (
                  <div className="flex items-center gap-1">
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full leading-none">
                        {item.badge}
                      </span>
                    )}
                    {hasChildren && (
                      <ChevronDown size={14} className={cn('transition-transform', isExpanded && 'rotate-180')} />
                    )}
                  </div>
                )}
              </div>

              {/* Children */}
              <AnimatePresence>
                {hasChildren && isExpanded && sidebarOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden ml-8 mt-0.5 space-y-0.5"
                  >
                    {item.children!.map(child => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                          pathname === child.href
                            ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-primary-500'
                        )}
                      >
                        <div className="w-1 h-1 rounded-full bg-current" />
                        {child.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800 space-y-1">
        <Link href="/" className={cn('sidebar-link')}>
          <Home size={18} />
          {sidebarOpen && <span>Beranda Publik</span>}
        </Link>
        <button onClick={handleLogout} className="sidebar-link text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 w-full">
          <LogOut size={18} />
          {sidebarOpen && <span>Keluar</span>}
        </button>
      </div>
    </div>
  );

  if (status === 'loading') return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Memuat sesi...</p>
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 72 }}
        transition={{ duration: 0.3 }}
        className="hidden lg:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex-shrink-0 overflow-hidden"
        style={{ height: '100vh', position: 'sticky', top: 0 }}
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-900 z-50 lg:hidden overflow-y-auto"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 h-16 flex items-center px-4 gap-4">
          {/* Sidebar toggle */}
          <button
            onClick={() => {
              setSidebarOpen(!sidebarOpen);
              setMobileSidebarOpen(!mobileSidebarOpen);
            }}
            className="btn-ghost p-2"
          >
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari kader, surat, arsip..."
                className="input pl-9 py-2 text-xs bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="btn-ghost p-2 text-gray-500"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="btn-ghost p-2 text-gray-500 relative"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center leading-none">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Notifikasi</h4>
                      <span className="badge badge-red">{unreadCount} baru</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-xs">Tidak ada notifikasi saat ini.</div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={cn(
                              'p-4 flex gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0',
                              !notif.dibaca && 'bg-primary-50/50 dark:bg-primary-900/10'
                            )}
                          >
                            <div className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm',
                              notif.jenis === 'success' ? 'bg-green-100 text-green-600' :
                              notif.jenis === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                              notif.jenis === 'error' ? 'bg-red-100 text-red-600' :
                              'bg-blue-100 text-blue-600'
                            )}>
                              {notif.jenis === 'success' ? '✓' : notif.jenis === 'warning' ? '!' : 'ℹ'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-medium text-gray-900 dark:text-white text-xs truncate">{notif.judul}</span>
                                {!notif.dibaca && <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{notif.pesan}</p>
                              <div className="text-xs text-gray-400 mt-1">{formatDateTime(notif.createdAt)}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-3 border-t border-gray-100 dark:border-gray-800">
                      <Link href="/dashboard/notifikasi" className="text-xs text-primary-500 hover:text-primary-700 font-medium flex justify-center" onClick={() => setNotifOpen(false)}>
                        Lihat semua notifikasi
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=007A33&color=fff`}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-gray-900 dark:text-white leading-tight max-w-24 truncate">{user.name}</div>
                  <div className="text-xs text-gray-400 leading-tight">{getRoleLabel(user.role)}</div>
                </div>
                <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                      <div className="font-semibold text-gray-900 dark:text-white text-sm">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                      <div className={cn('badge text-xs mt-1.5', getRoleColor(user.role))}>{getRoleLabel(user.role)}</div>
                    </div>
                    <div className="p-2 space-y-0.5">
                      <Link href="/dashboard/profil" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onClick={() => setProfileOpen(false)}>
                        <User size={15} /> Profil Saya
                      </Link>
                      <div className="py-2"></div>
                    </div>
                    <div className="p-2 border-t border-gray-100 dark:border-gray-800">
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <LogOut size={15} /> Keluar
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
