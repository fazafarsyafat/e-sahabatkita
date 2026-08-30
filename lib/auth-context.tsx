'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role } from '@/types';
import { mockUsers } from '@/lib/mock-data';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const rolePermissions: Record<Role, string[]> = {
  guest: ['view:public', 'verify:qr'],
  anggota: ['view:public', 'verify:qr', 'view:profile', 'create:pengajuan', 'view:materi', 'view:riwayat'],
  pengurus_rayon: ['view:public', 'verify:qr', 'view:profile', 'create:pengajuan', 'view:kader', 'manage:kader_rayon', 'view:agenda'],
  pengurus_komisariat: ['view:public', 'verify:qr', 'view:profile', 'view:kader', 'manage:kader_komisariat', 'view:agenda', 'create:agenda', 'view:kaderisasi', 'manage:kaderisasi'],
  pengurus_cabang: ['view:public', 'verify:qr', 'view:kader', 'manage:kader', 'view:surat', 'view:arsip', 'view:agenda', 'manage:agenda', 'view:kaderisasi', 'manage:kaderisasi', 'view:berita'],
  sekretaris: ['view:public', 'verify:qr', 'view:kader', 'manage:kader', 'manage:surat', 'manage:arsip', 'view:agenda', 'manage:agenda', 'view:kaderisasi', 'manage:berita', 'view:inventaris', 'manage:disposisi'],
  ketua: ['view:public', 'verify:qr', 'view:kader', 'manage:kader', 'approve:surat', 'manage:arsip', 'manage:agenda', 'manage:kaderisasi', 'manage:berita', 'view:laporan', 'approve:all'],
  admin: ['view:public', 'verify:qr', 'manage:kader', 'manage:surat', 'manage:arsip', 'manage:agenda', 'manage:kaderisasi', 'manage:berita', 'manage:inventaris', 'manage:users', 'view:audit', 'manage:pengumuman'],
  super_admin: ['*'],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('esahabat_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('esahabat_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password123') {
      const userObj: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role as Role,
        avatar: foundUser.avatar,
        jabatan: foundUser.jabatan,
      };
      setUser(userObj);
      localStorage.setItem('esahabat_user', JSON.stringify(userObj));
      setIsLoading(false);
      return { success: true };
    }
    setIsLoading(false);
    return { success: false, error: 'Email atau password salah' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('esahabat_user');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const perms = rolePermissions[user.role];
    return perms.includes('*') || perms.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
