'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, MapPin, Calendar, Clock, ArrowRight, ShieldCheck, CheckCircle, XCircle, UserPlus, Info } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

export default function UserKaderisasiDashboard() {
  const { data: session } = useSession();
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedProgram, setSelectedProgram] = useState<any | null>(null);
  const [showDaftarModal, setShowDaftarModal] = useState(false);
  const [showPresensiModal, setShowPresensiModal] = useState(false);

  // Forms
  const [daftarForm, setDaftarForm] = useState({ alasanIkut: '', pengalaman: '' });
  const [presensiCode, setPresensiCode] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/kaderisasi');
      const data = await res.json();
      if(Array.isArray(data)) setPrograms(data);
    } catch(e) {
      toast.error('Gagal memuat program kaderisasi');
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDaftar = async () => {
    if (!daftarForm.alasanIkut) return toast.error('Alasan mengikuti wajib diisi!');
    const tId = toast.loading('Mengirim formulir...');
    try {
      const res = await fetch(`/api/kaderisasi/${selectedProgram.id}/daftar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(daftarForm)
      });
      const d = await res.json();
      if (res.ok) {
        toast.success(d.message, { id: tId });
        setShowDaftarModal(false);
        fetchData(); // Refresh state
      } else {
        toast.error(d.error || 'Gagal mendaftar', { id: tId });
      }
    } catch(e) {
      toast.error('Kesalahan jaringan', { id: tId });
    }
  };

  const handlePresensi = async () => {
    if (!presensiCode) return toast.error('Masukkan kode presensi!');
    const tId = toast.loading('Mencatat kehadiran...');
    try {
      const res = await fetch(`/api/kaderisasi/${selectedProgram.id}/hadir`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kodePresensi: presensiCode })
      });
      const d = await res.json();
      if (res.ok) {
        toast.success(d.message, { id: tId });
        setShowPresensiModal(false);
        fetchData(); // Refresh state
      } else {
        toast.error(d.error || 'Gagal presensi', { id: tId });
      }
    } catch(e) {
      toast.error('Kesalahan jaringan', { id: tId });
    }
  };

  const getUserStatus = (pesertaArray: any[]) => {
    if (!session?.user?.email) return null;
    return pesertaArray.find(p => p.user?.email === session.user?.email);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Riwayat & Daftar Kaderisasi</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Pantau status pendaftaran, screening, dan isi presensi kegiatan wajib PMII Anda di sini.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Memuat data...</div>
      ) : programs.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-gray-500">
          Belum ada program kaderisasi yang tersedia saat ini.
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {programs.map((program, i) => {
            const myStatus = getUserStatus(program.peserta);

            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-all flex flex-col",
                  myStatus?.statusScreening === 'LULUS_SCREENING' && "border-green-200 dark:border-green-900/50 bg-green-50/30 dark:bg-green-900/10"
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg",
                      program.jenis === 'MAPABA' ? 'bg-gradient-to-br from-blue-500 to-blue-700' :
                      program.jenis === 'PKD' ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' : 'bg-gradient-to-br from-green-500 to-green-700'
                    )}>
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">{program.jenis} {program.angkatan}</h3>
                      <p className="text-xs text-gray-500">{program.komisariat || 'Tingkat Cabang'}</p>
                    </div>
                  </div>
                  <span className={cn('badge text-[10px]', program.status === 'OPEN' ? 'badge-blue' : program.status === 'ONGOING' ? 'badge-gold' : 'badge-green')}>
                    {program.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl mt-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                    <Calendar size={14} className="text-primary-500" />
                    <span>{formatDate(program.tanggalMulai)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                    <MapPin size={14} className="text-primary-500" />
                    <span className="truncate">{program.lokasi}</span>
                  </div>
                </div>

                {/* Status Section */}
                <div className="flex-1">
                  {myStatus ? (
                    <div className="mb-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                      <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Status Anda</div>
                      
                      {myStatus.statusScreening === 'PENDING' && (
                        <div className="flex items-center gap-2 text-amber-600 font-medium text-sm">
                          <Clock size={16} /> Sedang Ditinjau Admin (Menunggu ACC)
                        </div>
                      )}
                      
                      {myStatus.statusScreening === 'GAGAL_SCREENING' && (
                        <div className="flex items-center gap-2 text-red-600 font-medium text-sm">
                          <XCircle size={16} /> Gagal Screening
                        </div>
                      )}

                      {myStatus.statusScreening === 'LULUS_SCREENING' && (
                        <>
                          <div className="flex items-center gap-2 text-green-600 font-medium text-sm mb-3">
                            <CheckCircle size={16} /> Lulus Screening!
                          </div>
                          <div className="text-xs text-gray-500 border-t border-gray-200 dark:border-gray-700 pt-2 flex items-center justify-between">
                            <span>Status Kehadiran:</span>
                            {myStatus.waktuPresensi ? (
                              <span className="font-bold text-green-600">HADIR</span>
                            ) : (
                              <span className="font-bold text-amber-600">BELUM HADIR</span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="mb-4 text-sm text-gray-500 flex items-center gap-2">
                      <Info size={16}/> Anda belum terdaftar di kegiatan ini.
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                  {!myStatus && program.status === 'OPEN' && (
                    <button onClick={() => { setSelectedProgram(program); setShowDaftarModal(true); }} className="btn-primary flex-1 justify-center text-sm">
                      <UserPlus size={16} /> Daftar Screening
                    </button>
                  )}
                  
                  {myStatus?.statusScreening === 'LULUS_SCREENING' && !myStatus.waktuPresensi && (program.status === 'OPEN' || program.status === 'ONGOING') && (
                    <button onClick={() => { setSelectedProgram(program); setShowPresensiModal(true); }} className="btn-primary bg-green-600 hover:bg-green-700 flex-1 justify-center text-sm text-white">
                      <ShieldCheck size={16} /> Isi Kode Presensi
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal Pendaftaran Screening */}
      {showDaftarModal && selectedProgram && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDaftarModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white">Formulir Screening {selectedProgram.jenis}</h3>
              <button onClick={() => setShowDaftarModal(false)} className="btn-ghost p-2"><XCircle size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="label">Alasan Mengikuti Kegiatan Ini? <span className="text-red-500">*</span></label>
                <textarea rows={3} value={daftarForm.alasanIkut} onChange={e => setDaftarForm({...daftarForm, alasanIkut: e.target.value})} className="input" placeholder="Tuliskan motivasi Anda..." required />
              </div>
              <div>
                <label className="label">Pengalaman Organisasi Sebelumnya (Opsional)</label>
                <textarea rows={2} value={daftarForm.pengalaman} onChange={e => setDaftarForm({...daftarForm, pengalaman: e.target.value})} className="input" placeholder="Misal: BEM, HIMA, Pramuka..." />
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-3 rounded-lg text-xs">
                Data ini akan diverifikasi. Keputusan kelulusan screening mutlak berada di tangan penyelenggara.
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
              <button onClick={() => setShowDaftarModal(false)} className="btn-ghost text-sm">Batal</button>
              <button onClick={handleDaftar} className="btn-primary text-sm">Kirim Pengajuan</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Presensi */}
      {showPresensiModal && selectedProgram && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPresensiModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-sm w-full text-center p-6" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={32} />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">Kehadiran Acara</h3>
            <p className="text-xs text-gray-500 mb-6">Masukkan Kode Presensi 6-10 digit yang diberikan Panitia {selectedProgram.jenis}.</p>
            
            <input 
              type="text" 
              value={presensiCode} 
              onChange={e => setPresensiCode(e.target.value)} 
              className="input text-center text-2xl font-black tracking-[0.2em] uppercase py-4 mb-6" 
              placeholder="KODE" 
              maxLength={10}
            />
            
            <div className="flex justify-center gap-3">
              <button onClick={() => setShowPresensiModal(false)} className="btn-ghost flex-1">Batal</button>
              <button onClick={handlePresensi} className="btn-primary flex-1">Konfirmasi Hadir</button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
