'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Mail, Lock, User, MapPin, Building2, Eye, EyeOff, Phone, GraduationCap, BookOpen, Key } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [komisariats, setKomisariats] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    noTelepon: '',
    password: '',
    confirmPassword: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: 'LAKI_LAKI',
    alamat: '',
    asalKampus: '',
    fakultas: '',
    jurusan: '',
    tahunMasuk: '',
    komisariatId: '',
    rayonId: ''
  });

  useEffect(() => {
    fetch('/api/organisasi')
      .then(res => res.json())
      .then(data => setKomisariats(data.data || []))
      .catch(err => console.error(err));
  }, []);

  const selectedKomisariat = komisariats.find(k => k.id === formData.komisariatId);
  const availableRayons = selectedKomisariat?.rayon || [];

  // Reset rayonId when komisariat changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, rayonId: '' }));
  }, [formData.komisariatId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Konfirmasi password tidak cocok!');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat mendaftar');
      }

      toast.success(data.message || 'Pendaftaran berhasil!');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 relative overflow-hidden py-12">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden relative z-10 flex flex-col md:flex-row"
      >
        {/* Left Side: Branding */}
        <div className="w-full md:w-1/3 bg-gradient-to-br from-primary-600 to-blue-700 p-8 text-white flex flex-col justify-between hidden md:flex">
          <div>
            <div className="mb-8">
              <img src="/logo-wide.png" alt="E-Sahabat" className="h-10 w-auto object-contain" />
            </div>
            <h2 className="text-2xl font-bold leading-tight mb-4">Gerakan PMII.</h2>
            <p className="text-primary-100 text-sm leading-relaxed mb-6">
              Sistem informasi terpadu kaderisasi dan persuratan PMII. Pastikan Anda mengisi data akademik dengan valid.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-primary-50"><User size={14}/> Akun & Keamanan</div>
              <div className="flex items-center gap-2 text-sm text-primary-50"><GraduationCap size={14}/> Profil Akademik</div>
              <div className="flex items-center gap-2 text-sm text-primary-50"><Building2 size={14}/> Struktur PMII</div>
            </div>
          </div>
          <div>
            <p className="text-xs text-primary-200">© 2026 e-Sahabat PMII</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-2/3 p-6 md:p-10 h-[85vh] overflow-y-auto custom-scrollbar">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Daftar Akun Baru</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Lengkapi data di bawah ini untuk mengajukan pendaftaran anggota.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Akun Login */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Lock size={16} className="text-primary-500"/> Informasi Kontak & Akun
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nama Lengkap *" required className="input pl-10 text-sm py-2.5" />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Aktif *" required className="input pl-10 text-sm py-2.5" />
                </div>
                <div className="relative md:col-span-2">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" name="noTelepon" value={formData.noTelepon} onChange={handleChange} placeholder="Nomor WhatsApp *" required className="input pl-10 text-sm py-2.5" />
                </div>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Buat Password *" required className="input pl-10 pr-10 text-sm py-2.5" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Konfirmasi Password *" required className="input pl-10 pr-10 text-sm py-2.5" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-700" />

            {/* 2. Biodata Pribadi */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <User size={16} className="text-rose-500"/> Biodata Pribadi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" name="tempatLahir" value={formData.tempatLahir} onChange={handleChange} placeholder="Tempat Lahir *" required className="input pl-10 text-sm py-2.5" />
                </div>
                <div className="relative">
                  <input type="date" name="tanggalLahir" value={formData.tanggalLahir} onChange={handleChange} required className="input text-sm py-2.5 text-gray-500" />
                </div>
                <div className="relative md:col-span-2">
                  <select name="jenisKelamin" value={formData.jenisKelamin} onChange={handleChange} className="input text-sm py-2.5 text-gray-600">
                    <option value="LAKI_LAKI">Laki-Laki</option>
                    <option value="PEREMPUAN">Perempuan</option>
                  </select>
                </div>
                <div className="relative md:col-span-2">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                  <textarea name="alamat" value={formData.alamat} onChange={handleChange as any} placeholder="Alamat Lengkap *" required rows={2} className="input pl-10 text-sm py-2.5" />
                </div>
              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-700" />

            {/* 3. Profil Akademik */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <GraduationCap size={16} className="text-amber-500"/> Profil Akademik
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative md:col-span-2">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" name="asalKampus" value={formData.asalKampus} onChange={handleChange} placeholder="Perguruan Tinggi *" required className="input pl-10 text-sm py-2.5" />
                </div>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" name="fakultas" value={formData.fakultas} onChange={handleChange} placeholder="Fakultas *" required className="input pl-10 text-sm py-2.5" />
                </div>
                <div className="relative md:col-span-2">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" name="jurusan" value={formData.jurusan} onChange={handleChange} placeholder="Program Studi *" required className="input pl-10 text-sm py-2.5" />
                </div>
                <div className="relative md:col-span-2">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="number" name="tahunMasuk" value={formData.tahunMasuk} onChange={handleChange} placeholder="Tahun Masuk Kampus (misal: 2023) *" required className="input pl-10 text-sm py-2.5" />
                </div>
              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-700" />

            {/* 4. Struktur Organisasi */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <MapPin size={16} className="text-green-500"/> Struktur PMII (Opsional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <select name="komisariatId" value={formData.komisariatId} onChange={handleChange} className="input pl-10 text-sm py-2.5 text-gray-600">
                    <option value="">Pilih Komisariat</option>
                    {komisariats.map(k => (
                      <option key={k.id} value={k.id}>{k.nama}</option>
                    ))}
                  </select>
                </div>
                {availableRayons.length > 0 && (
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <select name="rayonId" value={formData.rayonId} onChange={handleChange} className="input pl-10 text-sm py-2.5 text-gray-600">
                      <option value="">Pilih Rayon</option>
                      {availableRayons.map((r: any) => (
                        <option key={r.id} value={r.id}>{r.nama}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-sm font-semibold shadow-xl shadow-primary-500/30 rounded-xl">
                {loading ? 'Mengirim Data...' : 'Kirim Pendaftaran'}
              </button>
            </div>
            
            <p className="text-center text-sm text-gray-500 pb-8">
              Sudah memiliki akun aktif? <Link href="/login" className="text-primary-600 font-bold hover:underline">Masuk di sini</Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
