'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Upload, Clock, CheckCircle, XCircle, AlertCircle, FileText, Download, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn, formatDate } from '@/lib/utils';

export default function FormPengajuanSKPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');

  // Form State
  const [loading, setLoading] = useState(false);
  const [tingkatan, setTingkatan] = useState('RAYON');
  const [namaStruktur, setNamaStruktur] = useState('');
  const [periode, setPeriode] = useState('');
  const [ketuaTerpilih, setKetuaTerpilih] = useState('');
  const [asalStruktur, setAsalStruktur] = useState('');
  const [fileSyaratUrl, setFileSyaratUrl] = useState('');

  // History State
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch('/api/pengajuan-sk');
      const data = await res.json();
      if (Array.isArray(data)) {
        setHistory(data);
      }
    } catch (e) {
      toast.error('Gagal memuat riwayat');
    }
    setLoadingHistory(false);
  };

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/pengajuan-sk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tingkatan, namaStruktur, periode, ketuaTerpilih, asalStruktur, fileSyaratUrl
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      toast.success('Pengajuan SK berhasil dikirim!');
      // Reset form
      setNamaStruktur(''); setPeriode(''); setKetuaTerpilih(''); setAsalStruktur(''); setFileSyaratUrl('');
      setActiveTab('history');
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengirim pengajuan');
    } finally {
      setLoading(false);
    }
  };

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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Pengajuan SK</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ajukan dan pantau permohonan penerbitan SK resmi.</p>
        </div>
        
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('form')}
            className={cn("px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2", activeTab === 'form' ? "bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400" : "text-gray-500 hover:text-gray-700")}
          >
            <Plus size={16} /> Buat Baru
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={cn("px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2", activeTab === 'history' ? "bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400" : "text-gray-500 hover:text-gray-700")}
          >
            <Clock size={16} /> Riwayat Saya
          </button>
        </div>
      </div>

      {activeTab === 'form' ? (
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit} 
          className="card p-6 space-y-5"
        >
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tingkatan Struktur</label>
              <select value={tingkatan} onChange={e => setTingkatan(e.target.value)} className="input text-sm">
                <option value="RAYON">Rayon</option>
                <option value="KOMISARIAT">Komisariat</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Asal Struktur Pemohon</label>
              <input type="text" value={asalStruktur} onChange={e => setAsalStruktur(e.target.value)} placeholder="Cth: Komisariat Hukum" required className="input text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nama Struktur yang Memohon SK</label>
            <input type="text" value={namaStruktur} onChange={e => setNamaStruktur(e.target.value)} placeholder="Cth: Rayon Hukum" required className="input text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Periode Kepengurusan</label>
              <input type="text" value={periode} onChange={e => setPeriode(e.target.value)} placeholder="Cth: 2026-2027" required className="input text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nama Ketua Terpilih</label>
              <input type="text" value={ketuaTerpilih} onChange={e => setKetuaTerpilih(e.target.value)} placeholder="Cth: Ahmad Fulan" required className="input text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Berkas Persyaratan SK (URL)</label>
            <div className="relative">
              <Upload className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="url" value={fileSyaratUrl} onChange={e => setFileSyaratUrl(e.target.value)} placeholder="Tautan Google Drive dokumen pendukung..." required className="input pl-10 text-sm" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Kumpulkan seluruh berkas dalam satu Google Drive (atau file cloud) yang dapat diakses publik.</p>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-sm">
              {loading ? 'Mengirim Data...' : 'Kirim Permohonan SK'}
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-0 overflow-hidden">
          {loadingHistory ? (
            <div className="p-10 text-center text-gray-500">Memuat riwayat...</div>
          ) : history.length === 0 ? (
            <div className="p-10 text-center text-gray-500 flex flex-col items-center">
              <FileText size={48} className="text-gray-300 dark:text-gray-700 mb-3" />
              <p>Anda belum pernah mengajukan SK.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 bg-gray-50/50 dark:bg-gray-800/50 uppercase border-b border-gray-100 dark:border-gray-800">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Tgl / Nomor Resi</th>
                    <th className="px-6 py-4 font-semibold">Struktur Diajukan</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Tindak Lanjut Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {history.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 dark:text-white font-mono text-xs">{p.nomorResi}</div>
                        <div className="text-xs text-gray-500 mt-1">{formatDate(p.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">{p.namaStruktur}</div>
                        <div className="text-[10px] text-gray-500 mt-1 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full inline-block">Ketua: {p.ketuaTerpilih} • {p.periode}</div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(p.status)}
                      </td>
                      <td className="px-6 py-4">
                        {p.status === 'DITERIMA' && p.fileBalasanUrl ? (
                          <a href={p.fileBalasanUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs text-green-600 hover:text-green-700 font-medium">
                            <Download size={14} /> Unduh SK
                          </a>
                        ) : p.catatanAdmin ? (
                          <div className="text-xs text-gray-500 italic max-w-[200px] line-clamp-2">"{p.catatanAdmin}"</div>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
