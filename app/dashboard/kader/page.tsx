'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Plus, Search, Download, Upload, Eye,
  Edit, Trash2, X, Check, FileText, User, Key
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

// ITEMS_PER_PAGE dihapus agar tampil semua dalam satu halaman scrollable
export default function KaderPage() {
  const { data: session } = useSession();
  const [kaders, setKaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  
  const [showModal, setShowModal] = useState(false);
  const [showKtaModal, setShowKtaModal] = useState(false);
  const [organisasiData, setOrganisasiData] = useState<any[]>([]);
  
  const [selectedKader, setSelectedKader] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'AKTIF' | 'PENDING'>('AKTIF');
  
  // File upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    namaLengkap: '', email: '', nia: '', jenisKelamin: 'LAKI_LAKI', tempatLahir: '', tanggalLahir: '',
    noTelepon: '', alamat: '', asalKampus: '', fakultas: '', jurusan: '', tahunMasuk: '',
    komisariatId: '', rayonId: '', statusMapaba: false, statusPKD: false, statusPKL: false,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/kader?search=${search}`);
      const data = await res.json();
      if(Array.isArray(data)) setKaders(data);
    } catch (e) {
      toast.error('Gagal memuat data kader');
    }
    setLoading(false);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 500); // 500ms delay untuk pencarian
    return () => clearTimeout(delayDebounce);
  }, [search]);

  useEffect(() => {
    fetch('/api/organisasi')
      .then(res => res.json())
      .then(d => {
        if (d.data) setOrganisasiData(d.data);
      })
      .catch(console.error);
  }, []);

  const handleExport = () => {
    toast.success('Mengunduh file Excel...');
    window.location.href = '/api/kader/export';
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    setUploading(true);
    const toastId = toast.loading('Sedang mengimpor data...');
    try {
      const res = await fetch('/api/kader/import', { method: 'POST', body: data });
      const result = await res.json();
      if (res.ok) {
        toast.success(result.message, { id: toastId });
        fetchData();
      } else {
        toast.error(result.error || 'Gagal impor file', { id: toastId });
      }
    } catch (error) {
      toast.error('Terjadi kesalahan pada server', { id: toastId });
    }
    setUploading(false);
    if(fileInputRef.current) fileInputRef.current.value = ''; // Reset input
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading('Menyimpan data...');
    
    const url = selectedKader ? `/api/kader/${selectedKader.id}` : '/api/kader';
    const method = selectedKader ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(res.ok) {
        toast.success('Berhasil menyimpan data', { id: toastId });
        setShowModal(false);
        fetchData();
      } else {
        toast.error(data.error || 'Gagal menyimpan', { id: toastId });
      }
    } catch(e) {
      toast.error('Terjadi kesalahan jaringan', { id: toastId });
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm('Apakah Anda yakin ingin menghapus data kader ini secara permanen?')) return;
    const toastId = toast.loading('Menghapus data...');
    try {
      const res = await fetch(`/api/kader/${id}`, { method: 'DELETE' });
      if(res.ok) {
        toast.success('Berhasil menghapus data', { id: toastId });
        fetchData();
      } else {
        toast.error('Gagal menghapus data', { id: toastId });
      }
    } catch(e) {
      toast.error('Terjadi kesalahan jaringan', { id: toastId });
    }
  };

  const handleApprove = async (userId: string, action: 'APPROVE'|'REJECT') => {
    const toastId = toast.loading('Memproses...');
    try {
      const res = await fetch('/api/user/approve', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ userId, action })
      });
      if (res.ok) {
        toast.success(action === 'APPROVE' ? 'Kader disetujui!' : 'Kader ditolak', { id: toastId });
        fetchData();
      } else {
        toast.error('Gagal memproses', { id: toastId });
      }
    } catch (e) {
      toast.error('Kesalahan jaringan', { id: toastId });
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if(!confirm('Yakin ingin mengubah jabatan pengguna ini?')) return;
    const toastId = toast.loading('Menyimpan jabatan...');
    try {
      const res = await fetch('/api/user/role', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ userId, newRole })
      });
      if (res.ok) {
        toast.success('Jabatan berhasil diubah!', { id: toastId });
        fetchData();
      } else {
        const d = await res.json();
        toast.error(d.error || 'Gagal mengubah', { id: toastId });
      }
    } catch (e) {
      toast.error('Kesalahan jaringan', { id: toastId });
    }
  };

  const handleGenerateAccount = async (kaderId: string, nama: string) => {
    if(!confirm(`Buat akun otomatis untuk ${nama}? Password bawaan adalah PMII2026.`)) return;
    
    const toastId = toast.loading('Membuat akun...');
    try {
      const res = await fetch('/api/user/generate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ kaderId })
      });
      const d = await res.json();
      if (res.ok) {
        toast.success(d.message, { id: toastId, duration: 8000 });
        fetchData();
      } else {
        toast.error(d.error || 'Gagal membuat akun', { id: toastId });
      }
    } catch (e) {
      toast.error('Kesalahan jaringan', { id: toastId });
    }
  };

  const handleResetPassword = async (userId: string, nama: string) => {
    if(!confirm(`Yakin ingin mereset sandi milik ${nama} kembali menjadi PMII2026?`)) return;
    const toastId = toast.loading('Mereset sandi...');
    try {
      const res = await fetch('/api/user/reset-password', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ userId })
      });
      const d = await res.json();
      if (res.ok) {
        toast.success(d.message, { id: toastId, duration: 8000 });
      } else {
        toast.error(d.error || 'Gagal mereset sandi', { id: toastId });
      }
    } catch (e) {
      toast.error('Kesalahan jaringan', { id: toastId });
    }
  };

  const openForm = (kader: any = null) => {
    if(kader) {
      setSelectedKader(kader);
      setFormData({
        namaLengkap: kader.namaLengkap || '',
        email: kader.user?.email || '',
        nia: kader.nia || '',
        jenisKelamin: kader.jenisKelamin || 'LAKI_LAKI',
        tempatLahir: kader.tempatLahir || '',
        tanggalLahir: kader.tanggalLahir ? new Date(kader.tanggalLahir).toISOString().split('T')[0] : '',
        noTelepon: kader.noTelepon || '',
        alamat: kader.alamat || '',
        asalKampus: kader.asalKampus || '',
        fakultas: kader.fakultas || '',
        jurusan: kader.jurusan || '',
        tahunMasuk: kader.tahunMasuk || '',
        komisariatId: kader.komisariatId || '',
        rayonId: kader.rayonId || '',
        statusMapaba: kader.statusMapaba || false,
        statusPKD: kader.statusPKD || false,
        statusPKL: kader.statusPKL || false,
      });
    } else {
      setSelectedKader(null);
      setFormData({
        namaLengkap: '', email: '', nia: '', jenisKelamin: 'LAKI_LAKI', tempatLahir: '', tanggalLahir: '',
        noTelepon: '', alamat: '', asalKampus: '', fakultas: '', jurusan: '', tahunMasuk: '',
        komisariatId: '', rayonId: '', statusMapaba: false, statusPKD: false, statusPKL: false
      });
    }
    setShowModal(true);
  };

  const openKTA = (kader: any) => {
    setSelectedKader(kader);
    setShowKtaModal(true);
  };

  const filteredKaders = kaders.filter((k: any) => {
    const statusApproval = k.user?.statusApproval || 'APPROVED';
    if (activeTab === 'AKTIF') return statusApproval === 'APPROVED';
    if (activeTab === 'PENDING') return statusApproval === 'PENDING';
    return true;
  });

  // Tampilkan semua data yang sudah difilter (tidak dipotong per halaman lagi)
  const paged = filteredKaders;

  return (
    <div className="space-y-5 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Database Kader</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manajemen data kader PC PMII Kabupaten Bandung</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExport} className="btn-ghost btn-sm border border-gray-200 dark:border-gray-700">
            <Download size={15} /> Export .xlsx
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImport} 
            accept=".xlsx, .xls" 
            className="hidden" 
          />
          <button disabled={uploading} onClick={() => fileInputRef.current?.click()} className="btn-ghost btn-sm border border-gray-200 dark:border-gray-700 relative overflow-hidden">
            {uploading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"/>
                Mengimpor...
              </span>
            ) : (
              <span className="flex items-center gap-2"><Upload size={15} /> Import .xlsx</span>
            )} 
          </button>

          <button onClick={() => openForm()} className="btn-primary text-sm py-2 px-4 shadow-lg shadow-primary-500/30">
            <Plus size={15} /> Tambah Kader
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <button onClick={() => { setActiveTab('AKTIF'); setPage(1); }} className={cn("px-4 py-2 text-sm font-semibold rounded-md transition-all", activeTab === 'AKTIF' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-gray-500 hover:text-gray-700')}>Kader Aktif</button>
            <button onClick={() => { setActiveTab('PENDING'); setPage(1); }} className={cn("px-4 py-2 text-sm font-semibold rounded-md transition-all flex items-center gap-2", activeTab === 'PENDING' ? 'bg-white dark:bg-gray-700 shadow-sm text-amber-600 dark:text-amber-400' : 'text-gray-500 hover:text-gray-700')}>
              Menunggu Persetujuan
              {kaders.filter((k:any) => k.user?.statusApproval === 'PENDING').length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px]">
                  {kaders.filter((k:any) => k.user?.statusApproval === 'PENDING').length}
                </span>
              )}
            </button>
          </div>
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Cari berdasarkan nama atau NIA..."
              className="input pl-9 py-2 text-sm bg-gray-50 dark:bg-gray-800"
            />
          </div>
        </div>
      </div>

      {/* Tabel Data Kader */}
      <div className="card p-0 overflow-hidden">
        <div className="w-full overflow-x-auto overflow-y-auto max-h-[65vh] custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 uppercase border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold">Kader</th>
                <th className="px-6 py-4 font-semibold">Komisariat / Rayon</th>
                <th className="px-6 py-4 font-semibold">Jenjang</th>
                <th className="px-6 py-4 font-semibold">KTA</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"/>
                  </td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    <Users size={36} className="mx-auto mb-2 opacity-30" />
                    <p>Tidak ada data kader ditemukan</p>
                  </td>
                </tr>
              ) : (
                paged.map((k: any) => (
                  <tr key={k.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center font-bold text-sm shadow-md">
                          {k.namaLengkap.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white text-sm">{k.namaLengkap}</div>
                          <div className="text-xs text-gray-500 font-mono mt-1 flex items-start gap-2">
                            <span className="mt-0.5">{k.nia || 'Tanpa NIA'}</span>
                            {k.user ? (
                              <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-bold text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded-full self-start">Memiliki Akun</span>
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 font-sans tracking-tight">📧 {k.user.email}</span>
                              </div>
                            ) : (
                              <span className="text-[9px] font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 px-1.5 py-0.5 rounded-full mt-0.5 self-start">Belum Ada Akun</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{k.komisariat?.nama || '-'}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{k.rayon?.nama || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {k.statusMapaba && <span className="badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-[10px]">MAPABA</span>}
                        {k.statusPKD && <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-[10px]">PKD</span>}
                        {k.statusPKL && <span className="badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800 text-[10px]">PKL</span>}
                        {!k.statusMapaba && !k.statusPKD && !k.statusPKL && <span className="text-xs text-gray-400">-</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {k.nia ? (
                        <button onClick={() => openKTA(k)} className="badge bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 hover:bg-primary-100 border border-primary-200 dark:border-primary-800 cursor-pointer transition-all hover:shadow-md group">
                          <Eye size={12} className="mr-1 group-hover:scale-110 transition-transform" /> KTA Aktif
                        </button>
                      ) : (
                        <span className="badge bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">Belum Ada</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {activeTab === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleApprove(k.user?.id, 'APPROVE')} className="btn-primary text-xs py-1.5 px-3">
                            <Check size={14} className="mr-1"/> Terima
                          </button>
                          <button onClick={() => handleApprove(k.user?.id, 'REJECT')} className="btn-ghost text-red-500 hover:bg-red-50 text-xs py-1.5 px-3">
                            <X size={14} className="mr-1"/> Tolak
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          {session?.user && (session.user as any).role === 'SUPER_ADMIN' && (
                            k.user ? (
                              <>
                                <select 
                                  value={k.user.role} 
                                  onChange={(e) => handleRoleChange(k.user.id, e.target.value)}
                                  className="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md py-1.5 px-2 cursor-pointer font-semibold text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                  <option value="USER">👦 Anggota</option>
                                  <option value="ADMIN_KOMISARIAT">🎓 Admin PK</option>
                                  <option value="ADMIN_CABANG">🏛️ Admin PC</option>
                                  <option value="SUPER_ADMIN">👑 Super Admin</option>
                                </select>
                                <button onClick={() => handleResetPassword(k.user.id, k.namaLengkap)} className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors" title="Reset Password">
                                  <Key size={16} />
                                </button>
                              </>
                            ) : (
                              <button onClick={() => handleGenerateAccount(k.id, k.namaLengkap)} className="badge bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800 cursor-pointer hover:bg-purple-200 shadow-sm transition-colors">
                                + Buat Akun
                              </button>
                            )
                          )}
                          <button onClick={() => openForm(k)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Edit">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(k.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Hapus">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal KTA Digital Eksklusif */}
      <AnimatePresence>
        {showKtaModal && selectedKader && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowKtaModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-[360px] z-10">
              
              {/* Kartu Fisik */}
              <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-950 rounded-2xl shadow-2xl overflow-hidden border border-white/20 relative group">
                
                {/* Efek kilauan kaca (Glassmorphism highlight) */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none transform -skew-x-12 translate-x-full group-hover:-translate-x-full" />
                
                {/* Header Kartu */}
                <div className="bg-white/10 backdrop-blur-md p-4 flex items-center gap-3 border-b border-white/10">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1 shadow-lg shrink-0">
                    {/* Logo Dummy PMII */}
                    <div className="w-full h-full bg-blue-600 rounded-full flex items-center justify-center">
                      <div className="w-3/4 h-3/4 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-[9px] font-black text-blue-900 leading-none">PMII</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-black text-[15px] leading-tight drop-shadow-md">KARTU TANDA ANGGOTA</h3>
                    <p className="text-white/80 text-[10px] font-medium tracking-wide">Pergerakan Mahasiswa Islam Indonesia</p>
                  </div>
                </div>
                
                {/* Body Kartu */}
                <div className="p-5 relative">
                  {/* Efek cahaya ambient */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex gap-4 items-start relative z-10">
                    <div className="w-24 h-32 bg-gray-900/40 backdrop-blur-sm rounded-lg overflow-hidden border-2 border-white/20 flex-shrink-0 flex flex-col items-center justify-center shadow-inner relative">
                       {/* Tempat Foto */}
                       <User size={36} className="text-white/30 mb-2" />
                       <span className="text-[8px] text-white/40 font-mono tracking-widest text-center px-2">PAS FOTO<br/>3x4</span>
                       <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold-400 to-gold-600" />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="text-[10px] text-gold-300 font-bold uppercase tracking-wider mb-0.5">NIA / KTA</p>
                        <p className="text-white font-mono text-[15px] font-bold tracking-widest bg-black/20 py-1 px-2 rounded border border-white/5 inline-block shadow-inner">{selectedKader.nia}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/50 uppercase tracking-wider mb-0.5">Nama Lengkap</p>
                        <p className="text-white font-black text-[15px] uppercase leading-tight drop-shadow-sm">{selectedKader.namaLengkap}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 relative z-10">
                     <div>
                       <p className="text-[9px] text-white/50 uppercase tracking-wider mb-0.5">Komisariat</p>
                       <p className="text-white text-[11px] font-bold truncate pr-2">{selectedKader.komisariat || '—'}</p>
                     </div>
                     <div>
                       <p className="text-[9px] text-white/50 uppercase tracking-wider mb-0.5">Rayon</p>
                       <p className="text-white text-[11px] font-bold truncate pr-2">{selectedKader.rayon || '—'}</p>
                     </div>
                     <div className="col-span-2">
                       <p className="text-[9px] text-white/50 uppercase tracking-wider mb-0.5">Asal Kampus</p>
                       <p className="text-white text-[11px] font-bold truncate">{selectedKader.asalKampus || '—'}</p>
                     </div>
                  </div>
                  
                  <div className="mt-5 pt-3 border-t border-white/10 flex justify-between items-end relative z-10">
                    <div>
                       <p className="text-[9px] text-white/50">Masa Berlaku</p>
                       <p className="text-gold-400 text-[10px] font-bold uppercase tracking-wider">Sepanjang Hayat</p>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-md p-1 shadow-lg">
                       {/* Barcode Dummy */}
                       <div className="w-full h-full border border-gray-200 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0djQwaC00em02IDBoMnY0MGgtMnptNCAwaDR2NDBoLTR6bTYgMGgxdjQwaC0xem0zIDBoMnY0MGgtMnptNCAwaDN2NDBoLTN6bTUgMGg0djQwaC00em02IDBoMnY0MGgtMnoiIGZpbGw9IiMwMDAiLz48L3N2Zz4=')] bg-cover bg-center opacity-80" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-5 text-center space-x-3">
                <button onClick={() => toast.success('Mengunduh KTA Digital...')} className="btn-primary py-2 px-5 rounded-full shadow-lg text-sm bg-white text-primary-700 hover:bg-gray-100">
                  <Download size={16} className="inline mr-2"/> Simpan KTA
                </button>
                <button onClick={() => setShowKtaModal(false)} className="btn-ghost text-white/70 hover:text-white text-sm">Tutup Pratinjau</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Form Modal (Tambah/Edit) */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 mt-10 sm:mt-0">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col border border-gray-100 dark:border-gray-800 z-10">
              
              {/* Header Modal */}
              <div className="flex items-center justify-between p-5 lg:p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 rounded-t-2xl">
                <div>
                  <h3 className="font-black text-xl text-gray-900 dark:text-white">{selectedKader ? 'Ubah Data Kader' : 'Registrasi Kader Baru'}</h3>
                  <p className="text-sm text-gray-500 mt-1">Lengkapi informasi biodata dan rekam jejak organisasi.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"><X size={20} /></button>
              </div>
              
              {/* Body Modal */}
              <div className="p-5 lg:p-6 overflow-y-auto flex-1 custom-scrollbar bg-white dark:bg-gray-900">
                <form id="kaderForm" onSubmit={handleSubmit} className="space-y-8">
                  {/* Biodata */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                      <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center"><User size={12}/></div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Identitas Diri</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="label">Nama Lengkap <span className="text-red-500">*</span></label>
                        <input required value={formData.namaLengkap} onChange={e=>setFormData({...formData, namaLengkap: e.target.value})} className="input" placeholder="Contoh: Ahmad Fauzi" />
                      </div>
                      <div>
                        <label className="label">Email Aktif (Gmail)</label>
                        <input type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="input" placeholder="contoh@gmail.com" />
                      </div>
                      <div>
                        <label className="label">NIA (Nomor Induk Anggota)</label>
                        <input value={formData.nia} onChange={e=>setFormData({...formData, nia: e.target.value})} className="input font-mono" placeholder="Kosongkan jika belum memiliki KTA" />
                      </div>
                      <div>
                        <label className="label">Jenis Kelamin</label>
                        <select value={formData.jenisKelamin} onChange={e=>setFormData({...formData, jenisKelamin: e.target.value})} className="input">
                          <option value="LAKI_LAKI">Laki-Laki</option>
                          <option value="PEREMPUAN">Perempuan</option>
                        </select>
                      </div>
                      <div>
                        <label className="label">No. Telepon / WhatsApp</label>
                        <input value={formData.noTelepon} onChange={e=>setFormData({...formData, noTelepon: e.target.value})} className="input" placeholder="08xxxxxxxxxx" />
                      </div>
                      <div>
                        <label className="label">Tempat Lahir</label>
                        <input value={formData.tempatLahir} onChange={e=>setFormData({...formData, tempatLahir: e.target.value})} className="input" />
                      </div>
                      <div>
                        <label className="label">Tanggal Lahir</label>
                        <input type="date" value={formData.tanggalLahir} onChange={e=>setFormData({...formData, tanggalLahir: e.target.value})} className="input" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="label">Alamat Lengkap</label>
                        <textarea value={formData.alamat} onChange={e=>setFormData({...formData, alamat: e.target.value})} className="input min-h-20" rows={2} />
                      </div>
                    </div>
                  </div>

                  {/* Kampus & Organisasi */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><FileText size={12}/></div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Akademik & Rayonisasi</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="label">Asal Kampus</label>
                        <input value={formData.asalKampus} onChange={e=>setFormData({...formData, asalKampus: e.target.value})} className="input" placeholder="Contoh: Universitas Islam Nusantara" />
                      </div>
                      <div>
                        <label className="label">Tahun Masuk Kampus</label>
                        <input type="number" value={formData.tahunMasuk} onChange={e=>setFormData({...formData, tahunMasuk: e.target.value})} className="input" placeholder="YYYY" />
                      </div>
                      <div>
                        <label className="label">Fakultas</label>
                        <input value={formData.fakultas} onChange={e=>setFormData({...formData, fakultas: e.target.value})} className="input" />
                      </div>
                      <div>
                        <label className="label">Jurusan / Program Studi</label>
                        <input value={formData.jurusan} onChange={e=>setFormData({...formData, jurusan: e.target.value})} className="input" />
                      </div>
                      <div>
                        <label className="label">Komisariat PMII</label>
                        <select value={formData.komisariatId} onChange={e=>setFormData({...formData, komisariatId: e.target.value, rayonId: ''})} className="input">
                          <option value="">-- Pilih Komisariat --</option>
                          {organisasiData.map((k: any) => (
                            <option key={k.id} value={k.id}>{k.nama}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="label">Rayon PMII</label>
                        <select value={formData.rayonId} onChange={e=>setFormData({...formData, rayonId: e.target.value})} className="input" disabled={!formData.komisariatId}>
                          <option value="">-- Boleh dikosongkan jika pengurus kom --</option>
                          {organisasiData.find((k: any) => k.id === formData.komisariatId)?.rayon?.map((r: any) => (
                            <option key={r.id} value={r.id}>{r.nama}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Jenjang Kaderisasi */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                      <div className="w-6 h-6 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center"><Check size={12}/></div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Rekam Jejak Kaderisasi Formal</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <label className="relative flex cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 shadow-sm focus-within:ring-2 focus-within:ring-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                        <div className="flex items-center h-5">
                          <input type="checkbox" checked={formData.statusMapaba} onChange={e=>setFormData({...formData, statusMapaba: e.target.checked})} className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                        </div>
                        <div className="ml-3 flex flex-col">
                          <span className="font-semibold text-gray-900 dark:text-white">MAPABA</span>
                          <span className="text-xs text-gray-500">Masa Penerimaan Anggota Baru</span>
                        </div>
                      </label>
                      <label className="relative flex cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 shadow-sm focus-within:ring-2 focus-within:ring-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                        <div className="flex items-center h-5">
                          <input type="checkbox" checked={formData.statusPKD} onChange={e=>setFormData({...formData, statusPKD: e.target.checked})} className="h-5 w-5 rounded border-gray-300 text-gold-500 focus:ring-gold-500" />
                        </div>
                        <div className="ml-3 flex flex-col">
                          <span className="font-semibold text-gray-900 dark:text-white">PKD</span>
                          <span className="text-xs text-gray-500">Pelatihan Kader Dasar</span>
                        </div>
                      </label>
                      <label className="relative flex cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 shadow-sm focus-within:ring-2 focus-within:ring-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                        <div className="flex items-center h-5">
                          <input type="checkbox" checked={formData.statusPKL} onChange={e=>setFormData({...formData, statusPKL: e.target.checked})} className="h-5 w-5 rounded border-gray-300 text-green-500 focus:ring-green-500" />
                        </div>
                        <div className="ml-3 flex flex-col">
                          <span className="font-semibold text-gray-900 dark:text-white">PKL</span>
                          <span className="text-xs text-gray-500">Pelatihan Kader Lanjut</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </form>
              </div>
              
              {/* Footer Modal */}
              <div className="p-5 lg:p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-b-2xl">
                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost py-2.5 px-5 text-gray-600 hover:bg-gray-200">Batalkan</button>
                <button type="submit" form="kaderForm" className="btn-primary py-2.5 px-6 shadow-lg shadow-primary-500/30">
                  {selectedKader ? 'Simpan Perubahan' : 'Simpan Data Baru'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
