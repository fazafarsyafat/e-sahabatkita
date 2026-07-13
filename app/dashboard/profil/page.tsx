'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Edit, Save, Phone, Mail, MapPin, Calendar, Shield, Key, Camera, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { cn, formatDate, getRoleLabel, getRoleColor, getJenjangBadge } from '@/lib/utils';
import { mockKader } from '@/lib/mock-data';
import toast from 'react-hot-toast';

export default function ProfilPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const [editing, setEditing] = useState(false);
  const kader = mockKader.find(k => k.email === user?.email) || mockKader[0];
  const [jabatanList, setJabatanList] = useState(kader?.riwayatJabatan || []);

  const toggleEdit = () => {
    if (!editing) setJabatanList(kader?.riwayatJabatan || []);
    setEditing(!editing);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Profil Saya</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Kelola informasi profil akun Anda</p>
        </div>
        <button onClick={toggleEdit} className={cn(editing ? 'btn-ghost border border-gray-200 dark:border-gray-700' : 'btn-primary', 'text-sm py-2 px-4')}>
          {editing ? 'Batal' : <><Edit size={15} /> Edit Profil</>}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Profile Card */}
        <div className="card p-6 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&background=007A33&color=fff&size=128`}
              alt={user?.name}
              className="w-28 h-28 rounded-3xl object-cover shadow-xl"
            />
            {editing && (
              <button className="absolute -bottom-2 -right-2 w-9 h-9 bg-primary-500 text-white rounded-full flex items-center justify-center shadow-lg">
                <Camera size={16} />
              </button>
            )}
          </div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white">{user?.name}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{user?.email}</p>
          <div className={cn('badge mt-2', getRoleColor(user?.role || ''))}>{getRoleLabel(user?.role || '')}</div>

          {kader && (
            <>
              <div className="w-full mt-5 pt-5 border-t border-gray-100 dark:border-gray-800 space-y-3">
                <div className={cn('badge w-full justify-center py-2', getJenjangBadge(kader.jenjangKaderisasi))}>
                  {kader.jenjangKaderisasi}
                </div>
                {kader.nomorKTA && (
                  <div className="badge badge-green w-full justify-center py-2">
                    KTA: {kader.nomorKTA}
                  </div>
                )}
              </div>
              <div className="w-full mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-400 mb-2">Komisariat & Rayon</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{kader.komisariat}</p>
                <p className="text-xs text-gray-500">{kader.rayon}</p>
              </div>
            </>
          )}
        </div>

        {/* Info Form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <User size={16} className="text-primary-500" /> Informasi Personal
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Nama Lengkap', value: kader?.nama, field: 'nama' },
                { label: 'NIM', value: kader?.nim, field: 'nim' },
                { label: 'NIK', value: kader?.nik, field: 'nik' },
                { label: 'No. HP', value: kader?.noHp, field: 'noHp' },
                { label: 'Tempat Lahir', value: kader?.tempatLahir, field: 'tempatLahir' },
                { label: 'Tanggal Lahir', value: kader ? formatDate(kader.tanggalLahir) : '', field: 'tanggalLahir' },
              ].map((item) => (
                <div key={item.field}>
                  <label className="label">{item.label}</label>
                  {editing ? (
                    <input className="input" defaultValue={item.value} />
                  ) : (
                    <div className="px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm text-gray-700 dark:text-gray-300">{item.value || '—'}</div>
                  )}
                </div>
              ))}
              <div className="col-span-2">
                <label className="label">Alamat</label>
                {editing ? (
                  <textarea className="input" rows={2} defaultValue={kader?.alamat} />
                ) : (
                  <div className="px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm text-gray-700 dark:text-gray-300">{kader?.alamat}</div>
                )}
              </div>
            </div>
            {editing && (
              <div className="flex justify-end mt-4">
                <button onClick={() => { toast.success('Profil berhasil diperbarui!'); setEditing(false); }} className="btn-primary text-sm py-2">
                  <Save size={15} /> Simpan Perubahan
                </button>
              </div>
            )}
          </div>

          {/* Riwayat Jabatan */}
          {(kader && kader.riwayatJabatan.length > 0) || editing ? (
            <div className="card p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Shield size={16} className="text-primary-500" /> Riwayat Jabatan
                </h3>
                {editing && (
                  <button onClick={() => setJabatanList([...jabatanList, { id: Date.now().toString(), jabatan: '', organisasi: '', periode: '' }])} className="text-xs text-primary-600 hover:underline font-bold">
                    + Tambah
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {jabatanList.map((r, i) => (
                  <div key={r.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    {!editing && <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />}
                    
                    {editing ? (
                      <div className="flex-1 grid grid-cols-12 gap-2">
                        <input className="col-span-5 input text-sm py-1.5 px-3" placeholder="Jabatan" value={r.jabatan} onChange={(e) => { const newL = [...jabatanList]; newL[i].jabatan = e.target.value; setJabatanList(newL); }} />
                        <input className="col-span-4 input text-sm py-1.5 px-3" placeholder="Organisasi" value={r.organisasi} onChange={(e) => { const newL = [...jabatanList]; newL[i].organisasi = e.target.value; setJabatanList(newL); }} />
                        <input className="col-span-3 input text-sm py-1.5 px-3" placeholder="Periode" value={r.periode} onChange={(e) => { const newL = [...jabatanList]; newL[i].periode = e.target.value; setJabatanList(newL); }} />
                      </div>
                    ) : (
                      <>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{r.jabatan}</span>
                          <span className="text-xs text-gray-400 ml-2">— {r.organisasi}</span>
                        </div>
                        <span className="badge badge-gray text-xs">{r.periode}</span>
                      </>
                    )}

                    {editing && (
                      <button onClick={() => setJabatanList(jabatanList.filter(item => item.id !== r.id))} className="text-red-500 hover:text-red-600 p-1 flex-shrink-0">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
                {jabatanList.length === 0 && !editing && (
                  <p className="text-sm text-gray-500">Belum ada riwayat jabatan.</p>
                )}
              </div>
            </div>
          ) : null}

          {/* Keamanan Akun */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Key size={16} className="text-primary-500" /> Keamanan Akun
            </h3>
            <div className="space-y-3">
              <div>
                <label className="label">Password Saat Ini</label>
                <input type="password" className="input" placeholder="••••••••" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Password Baru</label>
                  <input type="password" className="input" placeholder="Min. 8 karakter" />
                </div>
                <div>
                  <label className="label">Konfirmasi Password</label>
                  <input type="password" className="input" placeholder="Ulangi password baru" />
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={() => toast.success('Password berhasil diubah!')} className="btn-outline text-sm py-2 px-4">
                  Ganti Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
