import Link from 'next/link';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="container-lg py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="mb-4">
              <img src="/logo-wide.png" alt="E-Sahabat" className="h-10 w-auto object-contain brightness-0 invert" />
            </div>
            <p className="text-sm leading-relaxed text-gray-500 mb-4">
              Sistem Administrasi, Hub Arsip, dan Basis Anggota Terpadu milik Pengurus Cabang PMII Kabupaten Bandung.
            </p>
            <div className="flex gap-3">
              {['FB', 'IG', 'YT', 'TW'].map(s => (
                <div key={s} className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-xl flex items-center justify-center cursor-pointer transition-colors text-xs font-bold text-gray-300 hover:text-white">
                  {s}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Navigasi</h4>
            <ul className="space-y-2 text-sm">
              {['Beranda', 'Profil Organisasi', 'Berita', 'Agenda', 'Kaderisasi', 'Download', 'Kontak'].map(link => (
                <li key={link}>
                  <Link href={link === 'Beranda' ? '/' : '#'} className="hover:text-primary-400 transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Kontak</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-primary-400 mt-0.5 flex-shrink-0" />
                <span>Sekretariat PC PMII Kab. Bandung, Soreang, Jawa Barat</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-primary-400" />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-primary-400" />
                <span>info@esahabat.id</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe size={14} className="text-primary-400" />
                <span>www.esahabat.id</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs">
          <div>© 2026 PC PMII Kabupaten Bandung. Hak Cipta Dilindungi.</div>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-primary-400">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-primary-400">Syarat & Ketentuan</Link>
            <Link href="/verify/ESAH-2026-001" className="hover:text-primary-400">Verifikasi Dokumen</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
