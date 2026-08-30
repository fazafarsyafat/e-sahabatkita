'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, CheckCircle, Clock, XCircle, AlertCircle, Upload } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function PengajuanSuratPage() {
  const [pengajuans, setPengajuans] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected item states
  const [selectedSurat, setSelectedSurat] = useState<any>(null);
  const [status, setStatus] = useState('');
  const [catatanAdmin, setCatatanAdmin] = useState('');
  const [fileBalasanUrl, setFileBalasanUrl] = useState('');

  const fetchSuratReq = async () => {
    try {
      const res = await fetch('/api/pengajuan-surat');
      const data = await res.json();
      setPengajuans(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSuratReq();
  }, []);

  const openReviewModal = (s: any) => {
    setSelectedSurat(s);
    setStatus(s.status);
    setCatatanAdmin(s.catatanAdmin || '');
    setFileBalasanUrl(s.fileBalasanUrl || '');
    setShowModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSurat) return;

    if (status === 'DITERIMA' && !fileBalasanUrl) {
      toast.error('Wajib melampirkan tautan surat balasan jika disetujui');
      return;
    }

    try {
      toast.loading('Menyimpan pembaruan...', { id: 'update' });
      const res = await fetch(`/api/pengajuan-surat/${selectedSurat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, catatanAdmin, fileBalasanUrl })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan');
      
      toast.success('Status pengajuan berhasil diperbarui!', { id: 'update' });
      setShowModal(false);
      fetchSuratReq();
    } catch (error: any) {
      toast.error(error.message, { id: 'update' });
    }
  };

  const filtered = pengajuans.filter(p => {
    const matchStatus = activeFilter === 'Semua' || p.status === activeFilter;
    const matchSearch = p.nomorResi.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.namaPemohon.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.perihal.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'PENDING': return <span className="badge badge-gray text-xs"><Clock size={12} className="mr-1"/> Menunggu</span>;
      case 'DIPROSES': return <span className="badge badge-blue text-xs"><AlertCircle size={12} className="mr-1"/> Diproses</span>;
      case 'DITERIMA': return <span className="badge badge-green text-xs"><CheckCircle size={12} className="mr-1"/> Disetujui</span>;
      case 'DITOLAK': return <span className="badge badge-red text-xs"><XCircle size={12} className="mr-1"/> Ditolak</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Pengajuan Surat</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Tinjau permohonan penerbitan surat (Mandat, Keterangan, dll) dari kader</p>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
            {['Semua', 'PENDING', 'DIPROSES', 'DITERIMA', 'DITOLAK'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={cn(
                  "flex-1 sm:flex-none px-4 py-1.5 text-xs font-medium rounded-lg transition-all",
                  activeFilter === tab ? "bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                {tab === 'Semua' ? tab : tab === 'PENDING' ? 'Belum Direspon' : tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64 flex-shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari Resi / Pemohon / Perihal..." 
              className="input pl-9 text-sm"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-gray-50/50 dark:bg-gray-800/50 uppercase border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Tgl / Nomor Resi</th>
                <th className="px-6 py-4 font-semibold">Pemohon</th>
                <th className="px-6 py-4 font-semibold">Jenis & Perihal</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 dark:text-white font-mono text-xs">{p.nomorResi}</div>
                    <div className="text-xs text-gray-500 mt-1">{formatDate(p.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{p.namaPemohon}</div>
                    <div className="text-xs text-gray-500">{p.asalStruktur}</div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="badge badge-gray text-[10px] mb-1">{p.jenisSurat}</div>
                    <div className="font-medium text-gray-900 dark:text-white text-xs line-clamp-2">{p.perihal}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(p.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openReviewModal(p)} className="btn-primary text-xs py-1.5 px-3">
                      Tinjau
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    Tidak ada pengajuan ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tinjauan */}
      <AnimatePresence>
        {showModal && selectedSurat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold">Tinjauan Pengajuan Surat</h3>
                <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"><X size={18} /></button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6 border border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Nomor Resi</div>
                    <div className="font-semibold font-mono text-xs">{selectedSurat.nomorResi}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Pemohon</div>
                    <div className="font-semibold">{selectedSurat.namaPemohon}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Asal Struktur / Utusan</div>
                    <div className="font-semibold">{selectedSurat.asalStruktur}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Jenis Surat</div>
                    <div className="badge badge-gray text-xs font-semibold">{selectedSurat.jenisSurat}</div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mb-3">
                  <div className="text-gray-500 text-xs mb-1">Perihal / Tujuan Pengajuan</div>
                  <div className="font-medium text-sm leading-snug">{selectedSurat.perihal}</div>
                </div>
                
                {selectedSurat.tujuanSurat && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mb-3">
                    <div className="text-gray-500 text-xs mb-1">Ditujukan Kepada</div>
                    <div className="font-medium text-sm">{selectedSurat.tujuanSurat}</div>
                  </div>
                )}
                
                {selectedSurat.keterangan && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="text-gray-500 text-xs mb-1">Keterangan Tambahan Pemohon</div>
                    <div className="text-sm italic text-gray-700 dark:text-gray-300">"{selectedSurat.keterangan}"</div>
                  </div>
                )}
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="bg-primary-50/50 dark:bg-primary-900/10 rounded-xl p-4 border border-primary-100 dark:border-primary-900/30">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-4">Tindak Lanjut PC PMII</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Ubah Status Pengajuan</label>
                      <select value={status} onChange={e => setStatus(e.target.value)} className="input text-sm border-primary-200 focus:border-primary-500">
                        <option value="PENDING">Belum Direspon (Menunggu)</option>
                        <option value="DIPROSES">Sedang Diproses (Checking)</option>
                        <option value="DITERIMA">Disetujui & Surat Diterbitkan</option>
                        <option value="DITOLAK">Ditolak / Batal</option>
                      </select>
                    </div>

                    {status === 'DITERIMA' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                        <label className="block text-xs font-semibold text-primary-600 dark:text-primary-400 mb-1.5">Tautan Surat Balasan (Otomatis masuk Arsip Keluar)</label>
                        <div className="relative">
                          <Upload className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input 
                            type="text" 
                            value={fileBalasanUrl} 
                            onChange={e => setFileBalasanUrl(e.target.value)} 
                            placeholder="Link Google Drive dokumen PDF..." 
                            className="input pl-9 text-sm border-green-200 focus:border-green-500"
                            required
                          />
                        </div>
                      </motion.div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Catatan Untuk Pemohon (Opsional)</label>
                      <textarea 
                        value={catatanAdmin} 
                        onChange={e => setCatatanAdmin(e.target.value)} 
                        rows={3} 
                        className="input text-sm"
                        placeholder="Berikan alasan jika ditolak, atau instruksi spesifik jika disetujui..."
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1 justify-center">Batal</button>
                  <button type="submit" className="btn-primary flex-1 justify-center">
                    Simpan & Beritahu Pemohon
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
