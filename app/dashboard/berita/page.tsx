'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, Plus, Search, Edit, Trash2, X, Eye, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatDate } from '@/lib/utils';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Memuat ReactQuill secara dinamis agar tidak error saat dirender di Server (SSR)
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function BeritaPage() {
  const [beritas, setBeritas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedBerita, setSelectedBerita] = useState<any | null>(null);
  
  // State Form
  const [judul, setJudul] = useState('');
  const [konten, setKonten] = useState('');
  const [ringkasan, setRingkasan] = useState('');
  const [kategori, setKategori] = useState('Umum');
  const [gambarSampul, setGambarSampul] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Fungsi memuat data berita dari API
  const fetchBerita = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/berita');
      if (!res.ok) throw new Error('Gagal mengambil data berita');
      const data = await res.json();
      setBeritas(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBerita();
  }, []);

  const openModal = (berita: any = null) => {
    setSelectedBerita(berita);
    if (berita) {
      setJudul(berita.judul);
      setKonten(berita.konten);
      setRingkasan(berita.ringkasan);
      setKategori(berita.kategori);
      setGambarSampul(berita.gambarSampul || '');
      setIsPublished(berita.isPublished);
    } else {
      setJudul('');
      setKonten('');
      setRingkasan('');
      setKategori('Umum');
      setGambarSampul('');
      setIsPublished(true);
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul || !konten || konten === '<p><br></p>') {
      toast.error('Judul dan Konten wajib diisi!');
      return;
    }
    
    const payload = { judul, konten, ringkasan, kategori, gambarSampul, isPublished };
    const url = selectedBerita ? `/api/berita/${selectedBerita.id}` : '/api/berita';
    const method = selectedBerita ? 'PUT' : 'POST';

    try {
      toast.loading(selectedBerita ? 'Menyimpan perubahan...' : 'Menerbitkan berita...', { id: 'save-berita' });
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan');
      
      toast.success(selectedBerita ? 'Berita berhasil diperbarui!' : 'Berita berhasil dipublikasikan!', { id: 'save-berita' });
      setShowModal(false);
      fetchBerita();
    } catch (error: any) {
      toast.error(error.message, { id: 'save-berita' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini secara permanen?')) return;
    
    try {
      toast.loading('Menghapus berita...', { id: 'del-berita' });
      const res = await fetch(`/api/berita/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menghapus');
      
      toast.success('Berita terhapus!', { id: 'del-berita' });
      fetchBerita();
    } catch (error: any) {
      toast.error(error.message, { id: 'del-berita' });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Ukuran gambar maksimal 10MB');
      return;
    }

    try {
      setIsUploading(true);
      toast.loading('Mengunggah gambar...', { id: 'upload' });
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengunggah');

      setGambarSampul(data.url);
      toast.success('Gambar berhasil diunggah!', { id: 'upload' });
    } catch (error: any) {
      toast.error(error.message, { id: 'upload' });
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = ''; // reset file input
    }
  };

  // Konfigurasi Toolbar Editor
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link'],
      ['clean']
    ],
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Newspaper className="text-primary-600" /> Berita & Pengumuman
          </h1>
          <p className="text-sm text-gray-500 mt-1">Kelola publikasi dan rilis berita organisasi.</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary py-2 px-5 text-sm whitespace-nowrap shadow-lg shadow-primary-500/30">
          <Plus size={16} className="mr-2 inline" /> Tulis Berita
        </button>
      </div>

      {/* Daftar Berita */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          <div className="col-span-full py-20 text-center text-gray-500">Memuat arsip berita...</div>
        ) : beritas.length === 0 ? (
          <div className="col-span-full py-20 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
            Belum ada berita. Klik "Tulis Berita" untuk memulai.
          </div>
        ) : (
          beritas.map((berita) => (
            <div key={berita.id} className="card p-0 flex flex-col group overflow-hidden border border-gray-100 dark:border-gray-800">
              {/* Gambar Sampul (Jika ada) */}
              <div className="h-40 bg-gray-200 dark:bg-gray-800 relative">
                {berita.gambarSampul ? (
                  <img src={berita.gambarSampul} alt={berita.judul} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <FileText size={32} className="opacity-30 mb-2"/>
                    <span className="text-xs uppercase font-bold tracking-wider opacity-50">Tanpa Sampul</span>
                  </div>
                )}
                {!berita.isPublished && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md">DRAFT</div>
                )}
              </div>
              
              <div className="p-5 flex flex-col flex-grow">
                <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 tracking-wider uppercase mb-2">{berita.kategori}</span>
                <h3 className="font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">{berita.judul}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-grow">{berita.ringkasan}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="text-[10px] text-gray-400">
                    {formatDate(berita.createdAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openModal(berita)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors" title="Edit">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDelete(berita.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors" title="Hapus">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Editor Berita */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col border border-gray-100 dark:border-gray-800 z-10" style={{ maxHeight: '90vh' }}>
              
              <div className="p-5 lg:p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50 rounded-t-2xl flex-shrink-0">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{selectedBerita ? 'Edit Berita' : 'Tulis Berita Baru'}</h3>
                  <p className="text-xs text-gray-500 mt-1">Gunakan editor di bawah untuk menyusun konten.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full transition-colors">
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
              
              <div className="p-5 lg:p-6 overflow-y-auto custom-scrollbar flex-grow relative">
                <form id="beritaForm" onSubmit={handleSave} className="space-y-5">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Kolom Kiri: Meta Data */}
                    <div className="space-y-4 lg:col-span-1">
                      <div>
                        <label className="label">Kategori</label>
                        <select className="input" value={kategori} onChange={(e) => setKategori(e.target.value)}>
                          <option value="Umum">Umum</option>
                          <option value="Agenda PMII">Agenda PMII</option>
                          <option value="Opini Kader">Opini Kader</option>
                          <option value="Pengumuman">Pengumuman</option>
                          <option value="Pergerakan">Pergerakan</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="label flex justify-between items-center">
                          <span>Gambar Sampul (Opsional)</span>
                          {isUploading && <span className="text-[10px] text-primary-600 animate-pulse">Mengunggah...</span>}
                        </label>
                        <div className="flex gap-2 mb-2">
                          <input type="text" className="input text-sm flex-1" placeholder="Atau paste URL..." value={gambarSampul} onChange={(e) => setGambarSampul(e.target.value)} disabled={isUploading} />
                          <label className={`btn-outline cursor-pointer whitespace-nowrap text-sm px-3 flex items-center justify-center ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            Upload
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                          </label>
                        </div>
                        {gambarSampul && (
                          <div className="mt-2 rounded-lg overflow-hidden h-32 border border-gray-200 relative group">
                            <img src={gambarSampul} alt="Preview" className="w-full h-full object-cover" />
                            <button type="button" onClick={() => setGambarSampul('')} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">Hapus Sampul</button>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="label">Status Publikasi</label>
                        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                          <button type="button" onClick={() => setIsPublished(true)} className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${isPublished ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}>Publik</button>
                          <button type="button" onClick={() => setIsPublished(false)} className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${!isPublished ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}>Draft</button>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
                          {isPublished ? 'Berita akan langsung tampil di halaman depan (publik) setelah disimpan.' : 'Berita disembunyikan dari masyarakat, hanya tersimpan sebagai coretan.'}
                        </p>
                      </div>
                    </div>

                    {/* Kolom Kanan: Editor */}
                    <div className="space-y-4 lg:col-span-2 flex flex-col min-h-[400px]">
                      <div>
                        <label className="label">Judul Berita *</label>
                        <input type="text" className="input text-lg font-bold" placeholder="Tuliskan judul berita..." required value={judul} onChange={(e) => setJudul(e.target.value)} />
                      </div>
                      
                      <div className="flex flex-col flex-grow relative pb-10">
                        <label className="label">Konten Berita *</label>
                        <div className="flex-grow bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col" style={{ minHeight: '300px' }}>
                          <ReactQuill 
                            theme="snow" 
                            value={konten} 
                            onChange={setKonten}
                            modules={modules}
                            className="flex-grow flex flex-col border-none"
                            placeholder="Tuliskan paragraf berita Anda di sini..."
                          />
                        </div>
                        {/* Custom CSS to fix ReactQuill styling in dark mode and layout constraints */}
                        <style dangerouslySetInnerHTML={{__html: `
                          .ql-container { flex-grow: 1; border: none !important; font-family: inherit !important; font-size: 15px !important; }
                          .ql-editor { min-height: 250px; }
                          .ql-toolbar { border: none !important; border-bottom: 1px solid #e5e7eb !important; background: #f9fafb; }
                          .dark .ql-toolbar { background: #1f2937; border-bottom: 1px solid #374151 !important; }
                          .dark .ql-stroke { stroke: #d1d5db !important; }
                          .dark .ql-fill { fill: #d1d5db !important; }
                          .dark .ql-picker { color: #d1d5db !important; }
                          .dark .ql-editor.ql-blank::before { color: #6b7280; font-style: normal; }
                        `}} />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              
              <div className="p-5 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-b-2xl flex-shrink-0">
                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost py-2.5 px-5 text-gray-600 hover:bg-gray-200">Batal</button>
                <button type="submit" form="beritaForm" className="btn-primary py-2.5 px-6 shadow-lg shadow-primary-500/30">
                  {selectedBerita ? 'Simpan Perubahan' : 'Terbitkan Berita'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
