'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, MapPin, Clock, X, Trash2, Edit } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

const kategoriColors: Record<string, string> = {
  Rapat: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Pelatihan/Kajian': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Kaderisasi Formal': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Lainnya: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
};

const bulanList = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export default function AgendaPage() {
  const [agendas, setAgendas] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('semua');
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState<'list' | 'calendar'>('list');

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState('Rapat');
  const [lokasi, setLokasi] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [waktu, setWaktu] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [status, setStatus] = useState('Mendatang');

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const fetchAgenda = async () => {
    try {
      const res = await fetch('/api/agenda');
      const data = await res.json();
      setAgendas(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAgenda();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setJudul('');
    setKategori('Rapat');
    setLokasi('');
    setTanggal('');
    setWaktu('');
    setDeskripsi('');
    setStatus('Mendatang');
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (agenda: any) => {
    setEditingId(agenda.id);
    setJudul(agenda.judul);
    setKategori(agenda.kategori);
    setLokasi(agenda.lokasi);
    setStatus(agenda.status);
    setDeskripsi(agenda.deskripsi || '');
    
    // Convert UTC to local input format
    const d = new Date(agenda.waktuPelaksanaan);
    setTanggal(d.toISOString().split('T')[0]);
    // Fix timezone difference for time input
    setWaktu(d.toTimeString().slice(0, 5));
    
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul || !tanggal || !waktu || !lokasi) {
      toast.error('Mohon lengkapi semua kolom wajib');
      return;
    }

    try {
      const dateTimeString = `${tanggal}T${waktu}:00`;
      const url = editingId ? `/api/agenda/${editingId}` : '/api/agenda';
      const method = editingId ? 'PUT' : 'POST';

      toast.loading('Menyimpan...', { id: 'save' });
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          judul, kategori, lokasi, waktuPelaksanaan: dateTimeString, deskripsi, status
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan');
      
      toast.success(editingId ? 'Agenda diperbarui' : 'Agenda ditambahkan', { id: 'save' });
      setShowModal(false);
      fetchAgenda();
    } catch (error: any) {
      toast.error(error.message, { id: 'save' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus agenda ini?')) return;
    try {
      toast.loading('Menghapus...', { id: 'del' });
      const res = await fetch(`/api/agenda/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus');
      toast.success('Agenda terhapus', { id: 'del' });
      fetchAgenda();
    } catch (error: any) {
      toast.error(error.message, { id: 'del' });
    }
  };

  const filtered = agendas.filter(a =>
    activeFilter === 'semua' || a.status === activeFilter || a.kategori === activeFilter
  );

  const upcoming = filtered.filter(a => a.status === 'Mendatang');
  const past = filtered.filter(a => a.status === 'Selesai' || a.status === 'Dibatalkan');

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Agenda Kegiatan</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Kalender dan jadwal kegiatan organisasi</p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <button onClick={() => setView('list')} className={cn('px-3 py-2 text-xs font-medium transition-colors', view === 'list' ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400')}>List</button>
            <button onClick={() => setView('calendar')} className={cn('px-3 py-2 text-xs font-medium transition-colors', view === 'calendar' ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400')}>Kalender</button>
          </div>
          <button onClick={openAddModal} className="btn-primary text-sm py-2 px-4">
            <Plus size={15} /> Tambah Agenda
          </button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['semua', 'Mendatang', 'Selesai', 'Rapat', 'Pelatihan/Kajian', 'Kaderisasi Formal'].map(f => (
          <button key={f} onClick={() => setActiveFilter(f)} className={cn('px-4 py-2 rounded-xl text-xs font-semibold transition-all capitalize', activeFilter === f ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-50')}>
            {f === 'semua' ? 'Semua' : f}
          </button>
        ))}
      </div>

      {view === 'calendar' ? (
        <div className="card p-5">
          <div className="text-center mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">{bulanList[currentMonth]} {currentYear}</h3>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
              <div key={d} className="text-xs font-semibold text-gray-400 py-2">{d}</div>
            ))}
            {Array.from({ length: 35 }, (_, i) => {
              const firstDay = new Date(currentYear, currentMonth, 1).getDay();
              const day = i - firstDay + 1;
              const isCurrentMonth = day > 0 && day <= new Date(currentYear, currentMonth + 1, 0).getDate();
              const today = new Date().getDate();
              
              const hasAgenda = isCurrentMonth && agendas.some(a => {
                const d = new Date(a.waktuPelaksanaan);
                return d.getDate() === day && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
              });

              return (
                <div key={i} className={cn('rounded-lg p-1 text-xs aspect-square flex flex-col items-center justify-center cursor-pointer transition-colors relative', !isCurrentMonth && 'opacity-30', day === today && isCurrentMonth && 'bg-primary-500 text-white font-bold', isCurrentMonth && day !== today && 'hover:bg-gray-100 dark:hover:bg-gray-800')}>
                  {isCurrentMonth ? day : ''}
                  {hasAgenda && day !== today && <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1 animate-pulse" />}
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-400 mb-2">Agenda bulan ini:</p>
            {agendas.filter(a => new Date(a.waktuPelaksanaan).getMonth() === currentMonth).map(a => (
              <div key={a.id} className="flex items-center gap-2 py-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{new Date(a.waktuPelaksanaan).getDate()}</span>
                <span className="text-xs text-gray-500 line-clamp-1">- {a.judul}</span>
              </div>
            ))}
            {agendas.filter(a => new Date(a.waktuPelaksanaan).getMonth() === currentMonth).length === 0 && (
              <div className="text-xs text-gray-400 italic">Belum ada agenda di bulan ini.</div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {upcoming.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" /> Agenda Mendatang
              </h3>
              <div className="space-y-3">
                {upcoming.map((agenda, i) => (
                  <motion.div key={agenda.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-4 flex gap-4 items-start group hover:shadow-md">
                    <div className="flex-shrink-0 w-14 text-center">
                      <div className="bg-primary-500 text-white rounded-t-xl py-1">
                        <div className="text-xs">{new Date(agenda.waktuPelaksanaan).toLocaleDateString('id-ID', { month: 'short' })}</div>
                      </div>
                      <div className="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-b-xl py-2">
                        <div className="text-xl font-black">{new Date(agenda.waktuPelaksanaan).getDate()}</div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{agenda.judul}</h4>
                        <span className={cn('badge text-[10px] whitespace-nowrap', kategoriColors[agenda.kategori] || kategoriColors['Lainnya'])}>{agenda.kategori}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                        <span className="flex items-center gap-1"><Clock size={11} />{new Date(agenda.waktuPelaksanaan).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})} WIB</span>
                        <span className="flex items-center gap-1"><MapPin size={11} />{agenda.lokasi}</span>
                      </div>
                      {agenda.deskripsi && <div className="text-xs text-gray-500 line-clamp-1">{agenda.deskripsi}</div>}
                    </div>
                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(agenda)} className="text-blue-500 hover:text-blue-600 bg-blue-50 p-1.5 rounded-lg"><Edit size={14} /></button>
                      <button onClick={() => handleDelete(agenda.id)} className="text-red-500 hover:text-red-600 bg-red-50 p-1.5 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-500 dark:text-gray-500 text-sm mb-3 mt-8 flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full" /> Riwayat Kegiatan
              </h3>
              <div className="space-y-2">
                {past.map((agenda) => (
                  <div key={agenda.id} className="card p-3 flex gap-3 items-center opacity-70 group hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                      <div className="text-sm font-bold text-gray-500">{new Date(agenda.waktuPelaksanaan).getDate()}</div>
                      <div className="text-[10px] text-gray-400">{new Date(agenda.waktuPelaksanaan).toLocaleDateString('id-ID', { month: 'short' })}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-400 truncate">{agenda.judul}</h4>
                      <div className="text-[10px] text-gray-400 flex items-center gap-2 mt-1">
                        <Clock size={10} />{new Date(agenda.waktuPelaksanaan).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})} · <MapPin size={10} />{agenda.lokasi}
                      </div>
                    </div>
                    <span className={cn('badge text-[10px]', agenda.status === 'Selesai' ? 'badge-gray' : 'badge-red')}>{agenda.status}</span>
                    <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(agenda)} className="text-gray-400 hover:text-blue-500 p-1"><Edit size={12} /></button>
                      <button onClick={() => handleDelete(agenda.id)} className="text-gray-400 hover:text-red-500 p-1"><Trash2 size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {agendas.length === 0 && (
            <div className="text-center py-20 text-gray-400 border border-dashed rounded-2xl border-gray-200 dark:border-gray-800">
              Belum ada data agenda. Klik "Tambah Agenda" untuk membuat baru.
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
              <form onSubmit={handleSave}>
                <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="font-bold text-gray-900 dark:text-white">{editingId ? 'Edit Agenda' : 'Tambah Agenda Baru'}</h3>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-ghost p-2 rounded-full"><X size={18} /></button>
                </div>
                <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                  <div>
                    <label className="label">Judul Kegiatan *</label>
                    <input required className="input" placeholder="Nama kegiatan" value={judul} onChange={e => setJudul(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Kategori</label>
                      <select className="input" value={kategori} onChange={e => setKategori(e.target.value)}>
                        <option>Rapat</option>
                        <option>Pelatihan/Kajian</option>
                        <option>Kaderisasi Formal</option>
                        <option>Lainnya</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Status</label>
                      <select className="input" value={status} onChange={e => setStatus(e.target.value)}>
                        <option>Mendatang</option>
                        <option>Selesai</option>
                        <option>Dibatalkan</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Tanggal *</label>
                      <input required type="date" className="input" value={tanggal} onChange={e => setTanggal(e.target.value)} />
                    </div>
                    <div>
                      <label className="label">Waktu *</label>
                      <input required type="time" className="input" value={waktu} onChange={e => setWaktu(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="label">Lokasi *</label>
                    <input required className="input" placeholder="Tempat pelaksanaan" value={lokasi} onChange={e => setLokasi(e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Deskripsi</label>
                    <textarea className="input" rows={3} placeholder="Detail tambahan kegiatan..." value={deskripsi} onChange={e => setDeskripsi(e.target.value)} />
                  </div>
                </div>
                <div className="flex justify-end gap-3 p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-ghost">Batal</button>
                  <button type="submit" className="btn-primary">
                    <Plus size={15} /> Simpan Agenda
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
