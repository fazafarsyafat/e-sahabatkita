'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Menu, X, ChevronDown } from 'lucide-react';

export const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/profil', label: 'Profil', submenu: [
    { href: '/profil/sejarah', label: 'Sejarah' },
    { href: '/profil/visi-misi', label: 'Visi Misi' },
    { href: '/profil/struktur', label: 'Struktur Pengurus' },
  ]},
  { href: '/publikasi', label: 'Berita & Agenda', submenu: [
    { href: '/publikasi/berita', label: 'Berita' },
    { href: '/publikasi/agenda', label: 'Agenda' },
    { href: '/publikasi/galeri', label: 'Galeri' },
  ]},
  { href: '/kaderisasi', label: 'Kaderisasi', submenu: [
    { href: '/kaderisasi/mapaba', label: 'MAPABA' },
    { href: '/kaderisasi/pkd', label: 'PKD' },
    { href: '/kaderisasi/pkl', label: 'PKL' },
  ]},
  { href: '/surat', label: 'Surat', submenu: [
    { href: '/surat/pengajuan-surat', label: 'Pengajuan Surat' },
    { href: '/surat/pengajuan-sk', label: 'Pengajuan SK' },
    { href: '/surat/cek-ttd', label: 'Cek TTD Digital' },
  ]},
  { href: '/konsultasi-hukum', label: 'Konsultasi Hukum' },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-primary-500/95 backdrop-blur-md shadow-lg' : 'bg-primary-500 shadow-md'
    }`}>
      <div className="container-lg">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src="/logo-wide.png" alt="E-Sahabat" className="hidden sm:block h-12 lg:h-14 w-auto object-contain" />
            <img src="/logo-square.png" alt="E-Sahabat" className="sm:hidden h-10 w-auto object-contain" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div key={link.href} className="relative group">
                <Link
                  href={link.href}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-white/90 hover:text-white hover:bg-white/10"
                >
                  {link.label}
                  {link.submenu && <ChevronDown size={14} />}
                </Link>
                {link.submenu && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {link.submenu.map(sub => (
                      <Link key={sub.href} href={sub.href} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 first:rounded-t-xl last:rounded-b-xl transition-colors">
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 bg-white text-primary-500 hover:bg-gray-50 shadow-sm"
            >
              <Lock size={14} />
              Login
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="container-lg py-4 space-y-1">
              {navLinks.map((link) => (
                <div key={link.href}>
                  {link.submenu ? (
                    <button
                      onClick={() => setActiveSubmenu(activeSubmenu === link.label ? null : link.label)}
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                    >
                      {link.label}
                      <ChevronDown size={14} className={`transition-transform duration-200 ${activeSubmenu === link.label ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                    >
                      {link.label}
                    </Link>
                  )}
                  
                  <AnimatePresence>
                    {link.submenu && activeSubmenu === link.label && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-4 mt-1 overflow-hidden"
                      >
                        <div className="space-y-1 border-l-2 border-gray-100 ml-4 py-1">
                          {link.submenu.map(sub => (
                            <Link 
                              key={sub.href} 
                              href={sub.href}
                              onClick={() => setMenuOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-primary-600"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              <div className="pt-4 flex gap-2">
                <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-primary flex-1 justify-center text-sm py-2.5">
                  <Lock size={14} /> Login
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="btn-outline flex-1 justify-center text-sm py-2.5">
                  Daftar
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
