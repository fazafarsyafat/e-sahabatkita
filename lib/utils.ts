import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    aktif: 'badge-green',
    'non-aktif': 'badge-gray',
    alumni: 'badge-blue',
    draft: 'badge-gray',
    diproses: 'badge-blue',
    disetujui: 'badge-green',
    ditolak: 'badge-red',
    selesai: 'badge-green',
    open: 'badge-blue',
    berlangsung: 'badge-gold',
    upcoming: 'badge-blue',
    tersedia: 'badge-green',
    dipinjam: 'badge-gold',
    baik: 'badge-green',
    rusak_ringan: 'badge-gold',
    rusak_berat: 'badge-red',
  };
  return map[status] || 'badge-gray';
}

export function getJenjangBadge(jenjang: string): string {
  const map: Record<string, string> = {
    MAPABA: 'badge-blue',
    PKD: 'badge-gold',
    PKL: 'badge-green',
    None: 'badge-gray',
  };
  return map[jenjang] || 'badge-gray';
}

export function getRoleLabel(role: string): string {
  const map: Record<string, string> = {
    guest: 'Tamu',
    anggota: 'Anggota',
    pengurus_rayon: 'Pengurus Rayon',
    pengurus_komisariat: 'Pengurus Komisariat',
    pengurus_cabang: 'Pengurus Cabang',
    sekretaris: 'Sekretaris',
    ketua: 'Ketua',
    admin: 'Admin',
    super_admin: 'Super Admin',
  };
  return map[role] || role;
}

export function getRoleColor(role: string): string {
  const map: Record<string, string> = {
    super_admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    admin: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    ketua: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    sekretaris: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    pengurus_cabang: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
    pengurus_komisariat: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    pengurus_rayon: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    anggota: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    guest: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  };
  return map[role] || 'bg-gray-100 text-gray-700';
}

export function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len) + '...' : str;
}

export const romanMonths = [
  'I', 'II', 'III', 'IV', 'V', 'VI',
  'VII', 'VIII', 'IX', 'X', 'XI', 'XII'
];

export function generateNomorSuratFull(counter: number): string {
  const now = new Date();
  const month = romanMonths[now.getMonth()];
  const year = now.getFullYear();
  const num = String(counter).padStart(3, '0');
  return `${num}/PC-PMII-KBD/${month}/${year}`;
}
