'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Trash2, Edit, FileText, Search, Download } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ArsipSuratPage() {
  const [surats, setSurats] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('Semua');
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nomorSurat, setNomorSurat] = useState('');
  const [jenis, setJenis] = useState('MASUK');
  const [kategori, setKategori] = useState('Umum');
  const [perihal, setPerihal] = useState('');
  const [pengirim, setPengirim] = useState('');
  const [tujuan, setTujuan] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [keterangan, setKeterangan] = useState('');

  const fetchSurat = async () => {
    try {
      const res = await fetch('/api/surat');
      const data = await res.json();
      setSurats(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSurat();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setNomorSurat('');
    setJenis('MASUK');
    setKategori('Umum');
    setPerihal('');
    setPengirim('');
    setTujuan('');
    setTanggal(new Date().toISOString().split('T')[0]);
    setFileUrl('');
    setKeterangan('');
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (s: any) => {
    setEditingId(s.id);
    setNomorSurat(s.nomorSurat);
    setJenis(s.jenis);
    setKategori(s.kategori);
    setPerihal(s.perihal);
    setPengirim(s.pengirim || '');
    setTujuan(s.tujuan || '');
    setTanggal(new Date(s.tanggal).toISOString().split('T')[0]);
    setFileUrl(s.fileUrl || '');
    setKeterangan(s.keterangan || '');
    
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomorSurat || !perihal || !tanggal) {
      toast.error('Mohon lengkapi kolom wajib');
      return;
    }

    try {
      const url = editingId ? `/api/surat/${editingId}` : '/api/surat';
      const method = editingId ? 'PUT' : 'POST';

      toast.loading('Menyimpan...', { id: 'save' });
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomorSurat, jenis, kategori, perihal, pengirim, tujuan, tanggal: `${tanggal}T00:00:00Z`, fileUrl, keterangan
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan');
      
      toast.success(editingId ? 'Surat diperbarui' : 'Surat ditambahkan', { id: 'save' });
      setShowModal(false);
      fetchSurat();
    } catch (error: any) {
      toast.error(error.message, { id: 'save' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus arsip surat ini?')) return;
    try {
      toast.loading('Menghapus...', { id: 'del' });
      const res = await fetch(`/api/surat/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus');
      toast.success('Surat terhapus', { id: 'del' });
      fetchSurat();
    } catch (error: any) {
      toast.error(error.message, { id: 'del' });
    }
  };

  const filtered = surats.filter(s => {
    const matchTab = activeTab === 'Semua' || s.jenis === activeTab;
    const matchSearch = s.perihal.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        s.nomorSurat.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Arsip Persuratan</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Buku besar rekam jejak Surat Masuk dan Surat Keluar</p>
        </div>
        <button onClick={openAddModal} className="btn-primary text-sm py-2 px-4">
          <Plus size={15} /> Tambah Arsip
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-full sm:w-auto">
            {['Semua', 'MASUK', 'KELUAR'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 sm:flex-none px-4 py-1.5 text-xs font-medium rounded-lg transition-all",
                  activeTab === tab ? "bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                {tab === 'Semua' ? tab : `Surat ${tab.charAt(0) + tab.slice(1).toLowerCase()}`}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari surat..." 
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
                <th className="px-6 py-4 font-semibold">Tgl / Nomor</th>
                <th className="px-6 py-4 font-semibold">Perihal</th>
                <th className="px-6 py-4 font-semibold">Kategori</th>
                <th className="px-6 py-4 font-semibold">Asal / Tujuan</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 dark:text-white">{s.nomorSurat}</div>
                    <div className="text-xs text-gray-500 mt-1">{formatDate(s.tanggal)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white line-clamp-2">{s.perihal}</div>
                    {s.fileUrl && (
                      <a href={s.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] text-blue-500 hover:underline mt-1">
                        <FileText size={10} /> Lihat Dokumen
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "badge",
                      s.jenis === 'MASUK' ? 'badge-blue' : 'badge-green'
                    )}>
                      {s.jenis === 'MASUK' ? 'Masuk' : 'Keluar'} • {s.kategori}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-500">
                      {s.jenis === 'MASUK' ? (
                        <>Dari: <span className="font-medium text-gray-700 dark:text-gray-300">{s.pengirim}</span></>
                      ) : (
                        <>Kpd: <span className="font-medium text-gray-700 dark:text-gray-300">{s.tujuan}</span></>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openEditModal(s)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    Tidak ada arsip persuratan ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-xl z-50 p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold">{editingId ? 'Edit Arsip Surat' : 'Tambah Arsip Surat'}</h3>
                <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"><X size={18} /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Jenis Surat</label>
                    <select value={jenis} onChange={e => setJenis(e.target.value)} className="input text-sm">
                      <option value="MASUK">Surat Masuk</option>
                      <option value="KELUAR">Surat Keluar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Tanggal Surat</label>
                    <input type="date" value={tanggal} onChange={e => setTanggal(e.target.value)} required className="input text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Nomor Surat</label>
                    <input type="text" value={nomorSurat} onChange={e => setNomorSurat(e.target.value)} required placeholder="Mis: 01/PC/A-1/..." className="input text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Kategori</label>
                    <select value={kategori} onChange={e => setKategori(e.target.value)} className="input text-sm">
                      <option value="Umum">Umum</option>
                      <option value="SK">SK (Surat Keputusan)</option>
                      <option value="Mandat">Mandat</option>
                      <option value="Undangan">Undangan</option>
                      <option value="Pemberitahuan">Pemberitahuan</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Perihal</label>
                  <input type="text" value={perihal} onChange={e => setPerihal(e.target.value)} required className="input text-sm" />
                </div>

                {jenis === 'MASUK' ? (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Pengirim (Asal)</label>
                    <input type="text" value={pengirim} onChange={e => setPengirim(e.target.value)} required={jenis==='MASUK'} className="input text-sm" />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Tujuan Surat</label>
                    <input type="text" value={tujuan} onChange={e => setTujuan(e.target.value)} required={jenis==='KELUAR'} className="input text-sm" />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">URL File Fisik (Opsional)</label>
                  <input type="text" value={fileUrl} onChange={e => setFileUrl(e.target.value)} placeholder="Tautan Google Drive atau lampiran PDF" className="input text-sm" />
                </div>

                <div className="pt-2">
                  <button type="submit" className="btn-primary w-full justify-center">
                    {editingId ? 'Simpan Perubahan' : 'Tambahkan Arsip'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
