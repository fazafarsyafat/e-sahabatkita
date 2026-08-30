'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, CheckCircle, XCircle, FileText, User, Calendar, Hash, ArrowLeft, QrCode } from 'lucide-react';
import { mockSurat } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';

export default function VerifyPage() {
  const params = useParams();
  const kode = params.kode as string;
  const [checking, setChecking] = useState(true);
  const [surat, setSurat] = useState<typeof mockSurat[0] | null>(null);

  useEffect(() => {
    setTimeout(() => {
      const found = mockSurat.find(s => s.qrCode === kode);
      setSurat(found || null);
      setChecking(false);
    }, 1500);
  }, [kode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">ES</span>
            </div>
          </div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Verifikasi Dokumen</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">E-SAHABAT — PC PMII Kabupaten Bandung</p>
        </div>

        {checking ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-8 text-center"
          >
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">Memverifikasi dokumen...</p>
            <p className="text-sm text-gray-400 mt-1">Kode: <span className="font-mono">{kode}</span></p>
          </motion.div>
        ) : surat ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card overflow-hidden"
          >
            {/* Status Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle size={36} className="text-white" />
              </div>
              <h2 className="text-xl font-black text-white mb-1">Dokumen Valid</h2>
              <p className="text-green-100 text-sm">Dokumen ini asli dan sah</p>
            </div>

            {/* Dokumen Info */}
            <div className="p-6 space-y-4">
              {/* QR Code Display */}
              <div className="flex justify-center py-4">
                <div className="w-32 h-32 border-2 border-gray-200 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800">
                  <QrCode size={48} className="text-primary-500 mb-1" />
                  <span className="text-xs font-mono text-gray-500">{surat.qrCode}</span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { icon: Hash, label: 'Nomor Surat', value: surat.nomorSurat },
                  { icon: FileText, label: 'Perihal', value: surat.perihal },
                  { icon: User, label: 'Dibuat Oleh', value: surat.createdBy },
                  { icon: Calendar, label: 'Tanggal Surat', value: formatDate(surat.tanggal) },
                  { icon: Shield, label: 'Status Dokumen', value: surat.status.toUpperCase() },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="w-8 h-8 bg-primary-50 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon size={15} className="text-primary-500" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">{item.label}</div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Penandatangan */}
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 border border-primary-100 dark:border-primary-800">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={16} className="text-primary-500" />
                  <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">Informasi Penandatangan</span>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <div><span className="text-gray-500">Penandatangan:</span> Ketua Umum PC PMII Kab. Bandung</div>
                  <div><span className="text-gray-500">Jabatan:</span> Ketua Umum</div>
                  <div><span className="text-gray-500">Tanggal TTD:</span> {formatDate(surat.tanggal)}</div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-400 text-center">
                ⚠️ Verifikasi ini hanya menampilkan status dokumen. Untuk melihat isi dokumen, login ke sistem E-SAHABAT.
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card overflow-hidden"
          >
            <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <XCircle size={36} className="text-white" />
              </div>
              <h2 className="text-xl font-black text-white mb-1">Dokumen Tidak Valid</h2>
              <p className="text-red-100 text-sm">Kode QR tidak ditemukan dalam sistem</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                Kode <span className="font-mono font-bold text-gray-700 dark:text-gray-300">{kode}</span> tidak terdaftar dalam sistem E-SAHABAT. Dokumen ini mungkin palsu atau QR Code telah rusak.
              </p>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 text-xs text-red-600 dark:text-red-400">
                🚨 Jika Anda menerima dokumen ini, harap laporkan kepada pengurus PC PMII Kabupaten Bandung.
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex gap-3 mt-6">
          <Link href="/" className="btn-ghost border border-gray-200 dark:border-gray-700 flex-1 justify-center text-sm">
            <ArrowLeft size={15} /> Beranda
          </Link>
          <Link href="/login" className="btn-primary flex-1 justify-center text-sm">
            Masuk Sistem
          </Link>
        </div>
      </div>
    </div>
  );
}
