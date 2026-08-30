import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { NextAuthProvider } from '@/components/providers/NextAuthProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-SAHABAT — Sistem Administrasi, Hub Arsip, dan Basis Anggota Terpadu | PC PMII Kabupaten Bandung',
  description: 'E-SAHABAT adalah pusat layanan digital PC PMII Kabupaten Bandung yang mengintegrasikan administrasi organisasi, pengelolaan arsip, basis data kader, serta proses kaderisasi secara efektif, transparan, dan berkelanjutan.',
  keywords: ['PMII', 'Kabupaten Bandung', 'administrasi', 'organisasi', 'kaderisasi', 'E-SAHABAT'],
  authors: [{ name: 'PC PMII Kabupaten Bandung' }],
  openGraph: {
    title: 'E-SAHABAT — PC PMII Kabupaten Bandung',
    description: 'Sistem Administrasi, Hub Arsip, dan Basis Anggota Terpadu',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <NextAuthProvider>
            <AuthProvider>
              {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  borderRadius: '12px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                },
              }}
            />
            </AuthProvider>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
