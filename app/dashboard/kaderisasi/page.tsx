'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Users, Calendar, MapPin, CheckCircle, Clock, X, QrCode, Key, Eye, FileText, Trash2, GraduationCap, Trophy, Download } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

const jenisBadge: Record<string, string> = {
  MAPABA: 'badge-blue',
  PKD: 'badge-gold',
  PKL: 'badge-green',
};

const statusBadge: Record<string, string> = {
  OPEN: 'badge-blue',
  ONGOING: 'badge-gold',
  COMPLETED: 'badge-green',
  DRAFT: 'badge-gray',
};

export default function AdminKaderisasiPage() {
  const [activeTab, setActiveTab] = useState('jadwal'); // 'jadwal' | 'materi'
  const [programs, setPrograms] = useState<any[]>([]);
  const [materi, setMateri] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('semua');
  const [showModal, setShowModal] = useState(false);
  const [showMateriModal, setShowMateriModal] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    jenis: 'MAPABA', angkatan: '', lokasi: '', komisariat: '', deskripsi: '',
    tanggalMulai: '', tanggalSelesai: ''
  });

  // Form State Materi
  const [formMateri, setFormMateri] = useState({
    judul: '', jenjang: 'MAPABA', fileUrl: '', ukuran: '1.5 MB', format: 'PDF'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/kaderisasi');
      const data = await res.json();
      if(Array.isArray(data)) setPrograms(data);
    } catch(e) {
      toast.error('Gagal memuat data program');
    }
    setLoading(false);
  };

  const fetchMateri = async () => {
    try {
      const res = await fetch('/api/materi');
      const data = await res.json();
      if(Array.isArray(data)) setMateri(data);
    } catch(e) {
      toast.error('Gagal memuat pustaka materi');
    }
  };

  useEffect(() => { 
    if (activeTab === 'jadwal') fetchData(); 
    else fetchMateri();
  }, [activeTab]);

  const handleCreateMateri = async () => {
    if(!formMateri.judul || !formMateri.fileUrl) return toast.error('Isi form wajib!');
    const tId = toast.loading('Mengunggah...');
    try {
      const res = await fetch('/api/materi', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formMateri)
      });
      if(res.ok) {
        toast.success('Materi berhasil diunggah', { id: tId });
        setShowMateriModal(false);
        fetchMateri();
        setFormMateri({ judul: '', jenjang: 'MAPABA', fileUrl: '', ukuran: '1.5 MB', format: 'PDF' });
      } else {
        toast.error('Gagal mengunggah', { id: tId });
      }
    } catch(e) {
      toast.error('Kesalahan jaringan', { id: tId });
    }
  };

  const handleDeleteMateri = async (id: string) => {
    if(!confirm('Hapus materi ini secara permanen?')) return;
    const tId = toast.loading('Menghapus...');
    try {
      const res = await fetch(`/api/materi/${id}`, { method: 'DELETE' });
      if(res.ok) {
        toast.success('Dihapus', { id: tId });
        fetchMateri();
      } else {
        toast.error('Gagal', { id: tId });
      }
    } catch(e) {
      toast.error('Kesalahan', { id: tId });
    }
  };

  const handleCreate = async () => {
    if(!formData.jenis || !formData.angkatan || !formData.lokasi) {
      return toast.error('Lengkapi form wajib (*)');
    }
    const tId = toast.loading('Membuat program...');
    try {
      const res = await fetch('/api/kaderisasi', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success('Program berhasil dibuat', { id: tId });
        setShowModal(false);
        fetchData();
      } else {
        const d = await res.json();
        toast.error(d.error || 'Gagal', { id: tId });
      }
    } catch(e) {
      toast.error('Kesalahan jaringan', { id: tId });
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    const tId = toast.loading('Memperbarui status...');
    try {
      const res = await fetch(`/api/kaderisasi/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success('Status diperbarui', { id: tId });
        fetchData();
        if(selected) setSelected({...selected, status});
      } else {
        toast.error('Gagal', { id: tId });
      }
    } catch(e) {
      toast.error('Kesalahan jaringan', { id: tId });
    }
  };

  const handleUpdateKode = async (id: string) => {
    const newKode = prompt('Masukkan Kode Presensi Baru (Contoh: MPB2026):');
    if(!newKode) return;

    const tId = toast.loading('Menyimpan kode...');
    try {
      const res = await fetch(`/api/kaderisasi/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ kodePresensi: newKode })
      });
      if (res.ok) {
        toast.success('Kode disimpan', { id: tId });
        fetchData();
        if(selected) setSelected({...selected, kodePresensi: newKode});
      } else {
        const d = await res.json();
        toast.error(d.error || 'Gagal', { id: tId });
      }
    } catch(e) {
      toast.error('Kesalahan jaringan', { id: tId });
    }
  };

  const handleAcc = async (pesertaId: string, status: string) => {
    const tId = toast.loading('Memproses...');
    try {
      const res = await fetch(`/api/kaderisasi/${selected.id}/acc`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ pesertaId, status })
      });
      if (res.ok) {
        toast.success('Berhasil', { id: tId });
        fetchData();
        // Update local selected state
        const updatedPeserta = selected.peserta.map((p:any) => p.id === pesertaId ? {...p, statusScreening: status} : p);
        setSelected({...selected, peserta: updatedPeserta});
      } else {
        toast.error('Gagal', { id: tId });
      }
    } catch(e) {
      toast.error('Kesalahan jaringan', { id: tId });
    }
  };

  const filtered = programs.filter(k => activeFilter === 'semua' || k.jenis === activeFilter || k.status === activeFilter);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Sistem Kaderisasi</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manajemen Jadwal dan Pustaka Materi</p>
        </div>
        
        {/* Tab Navigasi Internal */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
          <button 
            onClick={() => setActiveTab('jadwal')}
            className={cn('px-5 py-2 rounded-lg text-sm font-bold transition-all', activeTab === 'jadwal' ? 'bg-white dark:bg-gray-700 shadow text-primary-600' : 'text-gray-500 hover:text-gray-700')}
          >
            Jadwal & Screening
          </button>
          <button 
            onClick={() => setActiveTab('materi')}
            className={cn('px-5 py-2 rounded-lg text-sm font-bold transition-all', activeTab === 'materi' ? 'bg-white dark:bg-gray-700 shadow text-primary-600' : 'text-gray-500 hover:text-gray-700')}
          >
            Pustaka Materi
          </button>
        </div>

        <button 
          onClick={() => activeTab === 'jadwal' ? setShowModal(true) : setShowMateriModal(true)} 
          className="btn-primary text-sm py-2 px-4"
        >
          <Plus size={15} /> {activeTab === 'jadwal' ? 'Program Baru' : 'Upload Materi'}
        </button>
      </div>

      {activeTab === 'jadwal' && (
        <>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {['semua', 'MAPABA', 'PKD', 'PKL', 'OPEN', 'ONGOING', 'COMPLETED'].map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-semibold transition-all capitalize',
              activeFilter === f ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-50'
            )}
          >
            {f === 'semua' ? 'Semua' : f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-10">Memuat data...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item, i) => {
            const pendaftar = item.peserta?.length || 0;
            const lulusScreening = item.peserta?.filter((p:any) => p.statusScreening === 'LULUS_SCREENING').length || 0;
            const hadir = item.peserta?.filter((p:any) => p.waktuPresensi != null).length || 0;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card p-5 hover:shadow-lg cursor-pointer flex flex-col"
                onClick={() => setSelected(item)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      item.jenis === 'MAPABA' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                      item.jenis === 'PKD' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600' :
                      'bg-green-100 dark:bg-green-900/30 text-green-600'
                    )}>
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white text-sm">{item.jenis} {item.angkatan}</div>
                      <div className="text-xs text-gray-400">{item.komisariat?.nama || 'Semua Wilayah'}</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 mb-3">
                  <span className={cn('badge', jenisBadge[item.jenis])}>{item.jenis}</span>
                  <span className={cn('badge', statusBadge[item.status])}>{item.status}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 mt-auto">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar size={13} className="text-primary-400" />
                    {formatDate(item.tanggalMulai)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin size={13} className="text-primary-400" />
                    <span className="truncate">{item.lokasi}</span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 grid grid-cols-3 text-center gap-2 divide-x divide-gray-200 dark:divide-gray-700">
                   <div>
                     <div className="text-lg font-black text-gray-700 dark:text-gray-200">{pendaftar}</div>
                     <div className="text-[9px] text-gray-500 uppercase tracking-wider">Pendaftar</div>
                   </div>
                   <div>
                     <div className="text-lg font-black text-blue-600">{lulusScreening}</div>
                     <div className="text-[9px] text-gray-500 uppercase tracking-wider">Di-ACC</div>
                   </div>
                   <div>
                     <div className="text-lg font-black text-green-600">{hadir}</div>
                     <div className="text-[9px] text-gray-500 uppercase tracking-wider">Hadir</div>
                   </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

        </>
      )}

      {activeTab === 'materi' && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Daftar Modul Terunggah</h3>
              <p className="text-xs text-gray-500">Materi ini akan langsung muncul di halaman portal Kaderisasi publik.</p>
            </div>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              <tr>
                <th className="p-4 font-semibold">Judul Materi</th>
                <th className="p-4 font-semibold">Jenjang</th>
                <th className="p-4 font-semibold">Format & Ukuran</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {materi.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-400 font-medium">Belum ada materi yang diunggah.</td></tr>
              ) : materi.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="p-4 font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-100 text-red-500 flex items-center justify-center"><FileText size={16}/></div>
                    {m.judul}
                  </td>
                  <td className="p-4"><span className={cn('badge', jenisBadge[m.jenjang])}>{m.jenjang}</span></td>
                  <td className="p-4 text-xs text-gray-500 font-medium">{m.format} • {m.ukuran}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a href={m.fileUrl} target="_blank" className="btn-ghost p-2 text-blue-500 hover:bg-blue-50" title="Lihat/Download"><Download size={16}/></a>
                      <button onClick={() => handleDeleteMateri(m.id)} className="btn-ghost p-2 text-red-500 hover:bg-red-50" title="Hapus"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Materi Modal */}
      {showMateriModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowMateriModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white">Upload Materi Baru</h3>
              <button onClick={() => setShowMateriModal(false)} className="btn-ghost p-2"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="label">Judul Materi *</label>
                <input value={formMateri.judul} onChange={e=>setFormMateri({...formMateri, judul: e.target.value})} className="input" placeholder="Contoh: Modul Sejarah PMII" />
              </div>
              <div>
                <label className="label">Jenjang *</label>
                <select value={formMateri.jenjang} onChange={e=>setFormMateri({...formMateri, jenjang: e.target.value})} className="input">
                  <option value="MAPABA">MAPABA</option><option value="PKD">PKD</option><option value="PKL">PKL</option>
                </select>
              </div>
              <div>
                <label className="label">URL File (Gdrive / Cloud) *</label>
                <input value={formMateri.fileUrl} onChange={e=>setFormMateri({...formMateri, fileUrl: e.target.value})} className="input" placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Format</label>
                  <input value={formMateri.format} onChange={e=>setFormMateri({...formMateri, format: e.target.value})} className="input" placeholder="PDF" />
                </div>
                <div>
                  <label className="label">Estimasi Ukuran</label>
                  <input value={formMateri.ukuran} onChange={e=>setFormMateri({...formMateri, ukuran: e.target.value})} className="input" placeholder="2.5 MB" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-gray-100 dark:border-gray-800">
              <button onClick={() => setShowMateriModal(false)} className="btn-ghost">Batal</button>
              <button onClick={handleCreateMateri} className="btn-primary">Upload Materi</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Buat Program Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white">Buat Program Kaderisasi Baru</h3>
              <button onClick={() => setShowModal(false)} className="btn-ghost p-2"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Jenis *</label>
                  <select value={formData.jenis} onChange={e=>setFormData({...formData, jenis: e.target.value})} className="input">
                    <option value="MAPABA">MAPABA</option><option value="PKD">PKD</option><option value="PKL">PKL</option>
                  </select>
                </div>
                <div>
                  <label className="label">Angkatan *</label>
                  <input value={formData.angkatan} onChange={e=>setFormData({...formData, angkatan: e.target.value})} className="input" placeholder="Contoh: XVI" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Tanggal Mulai</label><input type="date" value={formData.tanggalMulai} onChange={e=>setFormData({...formData, tanggalMulai: e.target.value})} className="input" /></div>
                <div><label className="label">Tanggal Selesai</label><input type="date" value={formData.tanggalSelesai} onChange={e=>setFormData({...formData, tanggalSelesai: e.target.value})} className="input" /></div>
              </div>
              <div><label className="label">Lokasi *</label><input value={formData.lokasi} onChange={e=>setFormData({...formData, lokasi: e.target.value})} className="input" placeholder="Nama tempat kegiatan" /></div>
              <div><label className="label">Komisariat (Opsional)</label><input value={formData.komisariat} onChange={e=>setFormData({...formData, komisariat: e.target.value})} className="input" placeholder="Kosongkan jika acara tingkat Cabang" /></div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-gray-100 dark:border-gray-800">
              <button onClick={() => setShowModal(false)} className="btn-ghost">Batal</button>
              <button onClick={handleCreate} className="btn-primary">Simpan Program</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Kelola (Manage) Program Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">{selected.jenis} {selected.angkatan}</h3>
                <p className="text-xs text-gray-500">Ubah status, atur presensi, dan ACC peserta di sini.</p>
              </div>
              <button onClick={() => setSelected(null)} className="btn-ghost p-2"><X size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Panel Kontrol Atas */}
              <div className="bg-primary-50 dark:bg-primary-900/10 p-4 rounded-xl border border-primary-100 dark:border-primary-900/30 flex flex-wrap gap-4 items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-primary-600 mb-1">Status Kegiatan:</div>
                  <select 
                    value={selected.status} 
                    onChange={(e) => handleUpdateStatus(selected.id, e.target.value)}
                    className="input text-sm py-1.5 font-bold"
                  >
                    <option value="OPEN">Pendaftaran Buka (OPEN)</option>
                    <option value="ONGOING">Sedang Berlangsung (ONGOING)</option>
                    <option value="COMPLETED">Selesai (COMPLETED)</option>
                    <option value="DRAFT">Disembunyikan (DRAFT)</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-[10px] text-gray-500 uppercase font-bold">Kode Presensi Rahasia</div>
                    <div className="font-mono text-lg font-black text-gray-900 dark:text-white tracking-widest">{selected.kodePresensi || 'BELUM DIATUR'}</div>
                  </div>
                  <button onClick={() => handleUpdateKode(selected.id)} className="btn-primary">
                    <Key size={16} /> Ubah Kode
                  </button>
                </div>
              </div>

              {/* Tabel Peserta */}
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Users size={18} className="text-blue-500"/> Daftar Peserta & Keputusan Screening
                </h4>
                
                <div className="overflow-x-auto border border-gray-100 dark:border-gray-800 rounded-xl">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
                      <tr>
                        <th className="p-3 font-semibold">Nama Pendaftar</th>
                        <th className="p-3 font-semibold">Alasan & Pengalaman</th>
                        <th className="p-3 font-semibold">Keputusan (ACC)</th>
                        <th className="p-3 font-semibold">Waktu Hadir</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {selected.peserta?.length === 0 ? (
                        <tr><td colSpan={4} className="p-5 text-center text-gray-400">Belum ada peserta yang mendaftar.</td></tr>
                      ) : (
                        selected.peserta?.map((p:any) => (
                          <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                            <td className="p-3">
                              <div className="font-bold text-gray-900 dark:text-white">{p.user?.name}</div>
                              <div className="text-xs text-gray-500">{p.user?.kader?.asalKampus || '-'}</div>
                            </td>
                            <td className="p-3">
                              <div className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[200px]" title={p.alasanIkut}>{p.alasanIkut || '-'}</div>
                            </td>
                            <td className="p-3">
                              {p.statusScreening === 'PENDING' ? (
                                <div className="flex gap-2">
                                  <button onClick={() => handleAcc(p.id, 'LULUS_SCREENING')} className="btn-primary btn-sm text-[10px] py-1 px-2">ACC Lulus</button>
                                  <button onClick={() => handleAcc(p.id, 'GAGAL_SCREENING')} className="btn-ghost btn-sm text-[10px] py-1 px-2 text-red-500">Tolak</button>
                                </div>
                              ) : (
                                <span className={cn('badge', p.statusScreening === 'LULUS_SCREENING' ? 'badge-green' : 'badge-red')}>
                                  {p.statusScreening === 'LULUS_SCREENING' ? 'LULUS (Di-ACC)' : 'DITOLAK'}
                                </span>
                              )}
                            </td>
                            <td className="p-3">
                              {p.waktuPresensi ? (
                                <span className="text-xs font-mono text-green-600 bg-green-50 px-2 py-1 rounded">
                                  ✅ {new Date(p.waktuPresensi).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">-</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
