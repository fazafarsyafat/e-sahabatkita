// ============================================================
// E-SAHABAT — Core TypeScript Types
// ============================================================

export type Role =
  | 'guest'
  | 'anggota'
  | 'pengurus_rayon'
  | 'pengurus_komisariat'
  | 'pengurus_cabang'
  | 'sekretaris'
  | 'ketua'
  | 'admin'
  | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  komisariat?: string;
  rayon?: string;
  jabatan?: string;
}

export type JenjangKaderisasi = 'MAPABA' | 'PKD' | 'PKL' | 'None';
export type StatusKeanggotaan = 'aktif' | 'non-aktif' | 'alumni';
export type JenisKelamin = 'L' | 'P';

export interface Kader {
  id: string;
  foto?: string;
  nama: string;
  nik: string;
  nim: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: JenisKelamin;
  alamat: string;
  email: string;
  noHp: string;
  komisariat: string;
  rayon: string;
  statusKeanggotaan: StatusKeanggotaan;
  statusAktif: boolean;
  jenjangKaderisasi: JenjangKaderisasi;
  statusKTA: 'aktif' | 'belum' | 'expired';
  nomorKTA?: string;
  riwayatJabatan: RiwayatJabatan[];
  riwayatPelatihan: RiwayatPelatihan[];
  createdAt: string;
  updatedAt: string;
}

export interface RiwayatJabatan {
  id: string;
  jabatan: string;
  organisasi: string;
  periode: string;
}

export interface RiwayatPelatihan {
  id: string;
  nama: string;
  tahun: string;
  keterangan?: string;
}

export type StatusSurat = 'draft' | 'diproses' | 'disetujui' | 'ditolak' | 'selesai';
export type JenisSurat = 'masuk' | 'keluar';

export interface Surat {
  id: string;
  nomorSurat: string;
  perihal: string;
  jenis: JenisSurat;
  tanggal: string;
  pengirim?: string;
  penerima?: string;
  status: StatusSurat;
  lampiran?: string[];
  keterangan?: string;
  qrCode?: string;
  createdBy: string;
  createdAt: string;
  riwayat: RiwayatSurat[];
}

export interface RiwayatSurat {
  id: string;
  aksi: string;
  oleh: string;
  tanggal: string;
  keterangan?: string;
}

export type KategoriArsip =
  | 'Surat'
  | 'SK'
  | 'LPJ'
  | 'Proposal'
  | 'MoU'
  | 'Foto'
  | 'Video'
  | 'Dokumen';

export interface Arsip {
  id: string;
  nama: string;
  kategori: KategoriArsip;
  tahun: string;
  tags: string[];
  ukuran: string;
  format: string;
  uploadedBy: string;
  createdAt: string;
  versi: number;
  deskripsi?: string;
  thumbnail?: string;
}

export type JenisKaderisasi = 'MAPABA' | 'PKD' | 'PKL';
export type StatusKaderisasi = 'open' | 'berlangsung' | 'selesai';

export interface Kaderisasi {
  id: string;
  jenis: JenisKaderisasi;
  angkatan: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  lokasi: string;
  status: StatusKaderisasi;
  peserta: number;
  lulusCount: number;
  komisariat?: string;
  deskripsi?: string;
}

export type KategoriAgenda = 'Rapat' | 'Pelatihan' | 'Diskusi' | 'Seminar' | 'Lainnya';

export interface Agenda {
  id: string;
  judul: string;
  kategori: KategoriAgenda;
  tanggal: string;
  waktu: string;
  lokasi: string;
  deskripsi?: string;
  penyelenggara: string;
  status: 'upcoming' | 'berlangsung' | 'selesai';
}

export interface Berita {
  id: string;
  judul: string;
  slug: string;
  konten: string;
  ringkasan: string;
  thumbnail: string;
  kategori: string;
  tags: string[];
  penulis: string;
  featured: boolean;
  publishedAt: string;
  viewCount: number;
}

export interface StatsDashboard {
  totalKader: number;
  totalKomisariat: number;
  totalRayon: number;
  suratMasuk: number;
  suratKeluar: number;
  arsipAktif: number;
  arsipTahunIni: number;
  agendaTerdekat: number;
  pengajuanSurat: number;
  notifikasiBaru: number;
}

export interface Notifikasi {
  id: string;
  judul: string;
  pesan: string;
  jenis: 'info' | 'success' | 'warning' | 'error';
  dibaca: boolean;
  createdAt: string;
  link?: string;
}

export interface Inventaris {
  id: string;
  nama: string;
  kode: string;
  lokasi: string;
  jumlah: number;
  kondisi: 'baik' | 'rusak_ringan' | 'rusak_berat';
  keterangan?: string;
  status: 'tersedia' | 'dipinjam';
}

export interface AuditLog {
  id: string;
  user: string;
  aksi: string;
  modul: string;
  detail: string;
  ip: string;
  timestamp: string;
}
