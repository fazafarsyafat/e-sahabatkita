'use client';

import { useState, useEffect } from 'react';
import { Building2, Plus, Edit, Trash2, Shield, Network, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Pengurus {
  id: string;
  nama: string;
  jabatan: string;
  divisi: string;
  urutan: number;
  periode: string;
}

export default function PengurusPage() {
  const [pengurus, setPengurus] = useState<Pengurus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    jabatan: '',
    divisi: 'Badan Pengurus Harian',
    urutan: 0,
    periode: ''
  });

  const fetchPengurus = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/pengurus');
      const data = await res.json();
      setPengurus(data);
    } catch (error) {
      toast.error('Gagal mengambil data pengurus');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPengurus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/pengurus/${editingId}` : '/api/pengurus';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error('Failed');
      
      toast.success(editingId ? 'Data berhasil diperbarui' : 'Data berhasil ditambahkan');
      setIsModalOpen(false);
      fetchPengurus();
    } catch (error) {
      toast.error('Gagal menyimpan data');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    try {
      const res = await fetch(`/api/pengurus/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      toast.success('Data berhasil dihapus');
      fetchPengurus();
    } catch (error) {
      toast.error('Gagal menghapus data');
    }
  };

  const openModal = (p?: Pengurus) => {
    if (p) {
      setEditingId(p.id);
      setFormData({ nama: p.nama, jabatan: p.jabatan, divisi: p.divisi, urutan: p.urutan, periode: p.periode || '' });
    } else {
      setEditingId(null);
      setFormData({ nama: '', jabatan: '', divisi: 'Badan Pengurus Harian', urutan: 0, periode: '' });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-xl text-primary-600 dark:text-primary-400">
            <Building2 size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Struktur Pengurus</h1>
            <p className="text-sm text-gray-500">Kelola daftar pengurus Cabang</p>
          </div>
        </div>
        <button onClick={() => openModal()} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
          <Plus size={16} /> Tambah Pengurus
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-gray-400" size={32} /></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-xs text-gray-500">
                  <th className="px-6 py-4 font-bold uppercase tracking-wider">Hirarki (Urutan)</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider">Nama & Jabatan</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider">Divisi</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider">Periode</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {pengurus.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Belum ada data struktur pengurus.
                    </td>
                  </tr>
                )}
                {pengurus.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="badge badge-gray font-mono">{p.urutan}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 dark:text-white">{p.nama}</div>
                      <div className="text-sm text-primary-600 dark:text-primary-400 font-medium">{p.jabatan}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="badge badge-blue">{p.divisi}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {p.periode || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openModal(p)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingId ? 'Edit Data Pengurus' : 'Tambah Pengurus Baru'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="label">Nama Lengkap</label>
                <input required type="text" className="input" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} placeholder="Contoh: H. Ahmad Zaenuri, S.Pd." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Jabatan</label>
                  <input required type="text" className="input" value={formData.jabatan} onChange={e => setFormData({...formData, jabatan: e.target.value})} placeholder="Ketua Umum" />
                </div>
                <div>
                  <label className="label">Urutan Hirarki</label>
                  <input required type="number" className="input" value={formData.urutan} onChange={e => setFormData({...formData, urutan: parseInt(e.target.value) || 0})} placeholder="1" />
                  <p className="text-[10px] text-gray-500 mt-1">Angka kecil tampil di atas (prioritas).</p>
                </div>
              </div>
              <div>
                <label className="label">Kategori / Divisi</label>
                <select className="input" value={formData.divisi} onChange={e => setFormData({...formData, divisi: e.target.value})}>
                  <option value="Badan Pengurus Harian">Badan Pengurus Harian</option>
                  <option value="Biro / Lembaga">Biro / Lembaga</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="label">Periode (Opsional)</label>
                <input type="text" className="input" value={formData.periode} onChange={e => setFormData({...formData, periode: e.target.value})} placeholder="2026-2027" />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 btn-ghost border border-gray-200 dark:border-gray-700 py-2.5">Batal</button>
                <button type="submit" className="flex-1 btn-primary py-2.5">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
