'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Clock, CheckCircle, XCircle, AlertCircle, Download, FileText, Plus } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';

export default function FormPengajuanSuratPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');
  
  // Form State
  const [loading, setLoading] = useState(false);
  const [namaPemohon, setNamaPemohon] = useState('');
  const [asalStruktur, setAsalStruktur] = useState('');
  const [jenisSurat, setJenisSurat] = useState('Mandat');
  const [perihal, setPerihal] = useState('');
  const [tujuanSurat, setTujuanSurat] = useState('');
  const [keterangan, setKeterangan] = useState('');

  // History State
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch('/api/pengajuan-surat');
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
      const res = await fetch('/api/pengajuan-surat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          namaPemohon, asalStruktur, jenisSurat, perihal, tujuanSurat, keterangan
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      toast.success('Permohonan Surat berhasil dikirim!');
      // Reset form
      setNamaPemohon(''); setAsalStruktur(''); setPerihal(''); setTujuanSurat(''); setKeterangan('');
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
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Pengajuan Surat</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ajukan dan pantau permohonan penerbitan surat ke Cabang.</p>
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
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nama Pemohon</label>
              <input type="text" value={namaPemohon} onChange={e => setNamaPemohon(e.target.value)} placeholder="Nama Lengkap / Tim" required className="input text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Asal Struktur / Kepanitiaan</label>
              <input type="text" value={asalStruktur} onChange={e => setAsalStruktur(e.target.value)} placeholder="Cth: Rayon Dakwah / Panitia RTK" required className="input text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Jenis Surat</label>
            <select value={jenisSurat} onChange={e => setJenisSurat(e.target.value)} className="input text-sm">
              <option value="Mandat">Surat Mandat</option>
              <option value="Keterangan Aktif">Surat Keterangan Aktif</option>
              <option value="Audiensi">Surat Audiensi / Permohonan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Perihal / Alasan Penerbitan</label>
            <input type="text" value={perihal} onChange={e => setPerihal(e.target.value)} placeholder="Cth: Permohonan Mandat PKD Cabang" required className="input text-sm" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tujuan Surat (Ditujukan Kepada)</label>
            <input type="text" value={tujuanSurat} onChange={e => setTujuanSurat(e.target.value)} placeholder="Cth: PC PMII Surabaya / Instansi Terkait" required className="input text-sm" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Keterangan Tambahan (Opsional)</label>
            <textarea value={keterangan} onChange={e => setKeterangan(e.target.value)} placeholder="Berikan catatan tambahan jika diperlukan..." rows={3} className="input text-sm" />
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-sm">
              {loading ? 'Mengirim Data...' : 'Kirim Permohonan Surat'}
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
              <p>Anda belum pernah mengajukan surat.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 bg-gray-50/50 dark:bg-gray-800/50 uppercase border-b border-gray-100 dark:border-gray-800">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Tgl / Nomor Resi</th>
                    <th className="px-6 py-4 font-semibold">Jenis & Perihal</th>
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
                      <td className="px-6 py-4 max-w-xs">
                        <div className="badge badge-gray text-[10px] mb-1">{p.jenisSurat}</div>
                        <div className="font-medium text-gray-900 dark:text-white text-xs line-clamp-2">{p.perihal}</div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(p.status)}
                      </td>
                      <td className="px-6 py-4">
                        {p.status === 'DITERIMA' && p.fileBalasanUrl ? (
                          <a href={p.fileBalasanUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs text-green-600 hover:text-green-700 font-medium">
                            <Download size={14} /> Unduh Surat
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
