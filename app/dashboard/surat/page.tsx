'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FileText, Plus, Search, Eye, Trash2, Edit, Download,
  QrCode, ChevronRight, Send, Inbox, X, ArrowLeft
} from 'lucide-react';
import { mockSurat } from '@/lib/mock-data';
import { Surat } from '@/types';
import { cn, formatDate, getStatusColor, generateNomorSuratFull } from '@/lib/utils';
import toast from 'react-hot-toast';

const tabs = ['semua', 'masuk', 'keluar', 'draft', 'diproses', 'disetujui', 'selesai'];

export default function SuratPage() {
  const [activeTab, setActiveTab] = useState('semua');
  const [search, setSearch] = useState('');
  const [selectedSurat, setSelectedSurat] = useState<Surat | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showBuat, setShowBuat] = useState(false);

  const filtered = mockSurat.filter(s => {
    const matchTab = activeTab === 'semua' || s.jenis === activeTab || s.status === activeTab;
    const matchSearch = !search || s.perihal.toLowerCase().includes(search.toLowerCase()) || s.nomorSurat.includes(search);
    return matchTab && matchSearch;
  });

  const statusIcons: Record<string, string> = {
    draft: '📝', diproses: '⏳', disetujui: '✅', ditolak: '❌', selesai: '🏁',
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Administrasi Surat</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Kelola surat masuk, keluar, dan disposisi</p>
        </div>
        <button onClick={() => setShowBuat(true)} className="btn-primary text-sm py-2 px-4">
          <Plus size={15} /> Buat Surat
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total Surat', value: mockSurat.length, color: 'text-gray-700 dark:text-gray-200' },
          { label: 'Masuk', value: mockSurat.filter(s => s.jenis === 'masuk').length, color: 'text-green-500' },
          { label: 'Keluar', value: mockSurat.filter(s => s.jenis === 'keluar').length, color: 'text-blue-500' },
          { label: 'Draft', value: mockSurat.filter(s => s.status === 'draft').length, color: 'text-gray-500' },
          { label: 'Diproses', value: mockSurat.filter(s => s.status === 'diproses').length, color: 'text-amber-500' },
        ].map((s, i) => (
          <div key={i} className="card p-4 text-center">
            <div className={cn('text-2xl font-black', s.color)}>{s.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all capitalize',
              activeTab === tab
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
            )}
          >
            {tab === 'semua' ? 'Semua' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari surat berdasarkan perihal atau nomor..."
          className="input pl-9 py-2 text-sm"
        />
      </div>

      {/* Surat List */}
      <div className="card overflow-hidden">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nomor Surat</th>
                <th>Perihal</th>
                <th>Jenis</th>
                <th>Tanggal</th>
                <th>Pengirim / Penerima</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <FileText size={36} className="mx-auto mb-2 opacity-30" />
                    <p>Tidak ada surat ditemukan</p>
                  </td>
                </tr>
              ) : (
                filtered.map((surat, i) => (
                  <motion.tr key={surat.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                    <td>
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-gray-400 flex-shrink-0" />
                        <span className="text-xs font-mono text-gray-700 dark:text-gray-300">{surat.nomorSurat}</span>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm font-medium text-gray-900 dark:text-white max-w-xs truncate">{surat.perihal}</div>
                      {surat.keterangan && <div className="text-xs text-gray-400 truncate max-w-xs">{surat.keterangan}</div>}
                    </td>
                    <td>
                      <span className={cn('badge', surat.jenis === 'masuk' ? 'badge-green' : 'badge-blue')}>
                        {surat.jenis === 'masuk' ? <Inbox size={10} className="mr-1" /> : <Send size={10} className="mr-1" />}
                        {surat.jenis}
                      </span>
                    </td>
                    <td><span className="text-xs text-gray-500">{formatDate(surat.tanggal)}</span></td>
                    <td>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {surat.jenis === 'masuk' ? surat.pengirim : surat.penerima}
                      </span>
                    </td>
                    <td>
                      <span className={cn('badge', getStatusColor(surat.status))}>
                        {statusIcons[surat.status]} {surat.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setSelectedSurat(surat); setShowDetail(true); }} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500" title="Detail">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => toast.success('Download PDF dimulai...')} className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-500" title="Download">
                          <Download size={14} />
                        </button>
                        {surat.qrCode && (
                          <Link href={`/verify/${surat.qrCode}`} target="_blank" className="p-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-500" title="QR Verifikasi">
                            <QrCode size={14} />
                          </Link>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetail && selectedSurat && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDetail(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white">Detail Surat</h3>
              <button onClick={() => setShowDetail(false)} className="btn-ghost p-2"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{selectedSurat.perihal}</h4>
                  <p className="text-sm font-mono text-primary-500 mt-0.5">{selectedSurat.nomorSurat}</p>
                </div>
                <span className={cn('badge', getStatusColor(selectedSurat.status))}>{selectedSurat.status}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Jenis Surat', value: selectedSurat.jenis },
                  { label: 'Tanggal', value: formatDate(selectedSurat.tanggal) },
                  { label: selectedSurat.jenis === 'masuk' ? 'Dari' : 'Kepada', value: selectedSurat.jenis === 'masuk' ? selectedSurat.pengirim : selectedSurat.penerima },
                  { label: 'Dibuat Oleh', value: selectedSurat.createdBy },
                ].map((item, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                    <div className="text-xs text-gray-400">{item.label}</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{item.value}</div>
                  </div>
                ))}
              </div>

              {selectedSurat.keterangan && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                  <div className="text-xs text-gray-400 mb-1">Keterangan</div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{selectedSurat.keterangan}</p>
                </div>
              )}

              {/* QR Code */}
              {selectedSurat.qrCode && (
                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 flex items-center gap-3">
                  <QrCode size={24} className="text-primary-500 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500">Kode Verifikasi QR</div>
                    <div className="font-mono text-sm font-bold text-primary-600">{selectedSurat.qrCode}</div>
                    <Link href={`/verify/${selectedSurat.qrCode}`} target="_blank" className="text-xs text-primary-500 hover:underline">Verifikasi dokumen →</Link>
                  </div>
                </div>
              )}

              {/* Tracking */}
              <div>
                <h5 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Riwayat Surat</h5>
                <div className="space-y-2">
                  {selectedSurat.riwayat.map((r, i) => (
                    <div key={r.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">{i + 1}</span>
                        </div>
                        {i < selectedSurat.riwayat.length - 1 && <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 my-1" />}
                      </div>
                      <div className="pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{r.aksi}</span>
                          <span className="text-xs text-gray-400">oleh {r.oleh}</span>
                        </div>
                        {r.keterangan && <p className="text-xs text-gray-500 mt-0.5">{r.keterangan}</p>}
                        <div className="text-xs text-gray-400 mt-0.5">{formatDate(r.tanggal)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-gray-100 dark:border-gray-800">
              <button onClick={() => toast.success('Download PDF surat...')} className="btn-outline flex-1 justify-center text-sm py-2">
                <Download size={14} /> Download PDF
              </button>
              {selectedSurat.status === 'draft' && (
                <button onClick={() => { toast.success('Surat dikirim untuk persetujuan'); setShowDetail(false); }} className="btn-primary flex-1 justify-center text-sm py-2">
                  <Send size={14} /> Kirim
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Buat Surat Modal */}
      {showBuat && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowBuat(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white">Buat Surat Baru</h3>
              <button onClick={() => setShowBuat(false)} className="btn-ghost p-2"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              {/* Nomor otomatis */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 flex items-center gap-3">
                <FileText size={16} className="text-green-500" />
                <div>
                  <div className="text-xs text-gray-500">Nomor Surat (Otomatis)</div>
                  <div className="font-mono text-sm font-bold text-green-700 dark:text-green-400">{generateNomorSuratFull(mockSurat.length + 1)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Jenis Surat</label>
                  <select className="input">
                    <option value="keluar">Surat Keluar</option>
                    <option value="masuk">Surat Masuk</option>
                  </select>
                </div>
                <div>
                  <label className="label">Tanggal Surat</label>
                  <input type="date" className="input" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>

              <div>
                <label className="label">Perihal / Subjek Surat *</label>
                <input className="input" placeholder="Masukkan perihal surat..." />
              </div>

              <div>
                <label className="label">Penerima</label>
                <input className="input" placeholder="Nama / jabatan penerima" />
              </div>

              <div>
                <label className="label">Template Surat</label>
                <select className="input">
                  <option value="">Pilih Template (Opsional)</option>
                  <option value="undangan">Surat Undangan</option>
                  <option value="rekomendasi">Surat Rekomendasi</option>
                  <option value="permohonan">Surat Permohonan</option>
                  <option value="keterangan">Surat Keterangan</option>
                </select>
              </div>

              <div>
                <label className="label">Isi Surat</label>
                <textarea className="input font-mono text-xs" rows={8} placeholder="Tulis isi surat di sini..." />
              </div>

              <div>
                <label className="label">Lampiran</label>
                <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-400">Drop file atau klik untuk upload</p>
                  <p className="text-xs text-gray-300 mt-0.5">PDF, DOC, JPG maks 10MB</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-gray-100 dark:border-gray-800">
              <button onClick={() => setShowBuat(false)} className="btn-ghost">Batal</button>
              <button onClick={() => { toast.success('Surat disimpan sebagai draft'); setShowBuat(false); }} className="btn-ghost border border-gray-200 dark:border-gray-700">
                Simpan Draft
              </button>
              <button onClick={() => { toast.success('Surat dikirim untuk persetujuan'); setShowBuat(false); }} className="btn-primary ml-auto">
                <Send size={15} /> Kirim untuk Persetujuan
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
