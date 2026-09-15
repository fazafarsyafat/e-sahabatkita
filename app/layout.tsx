import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { NextAuthProvider } from '@/components/providers/NextAuthProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from 'react-hot-toast';
import { OrganizationJsonLd } from '@/components/seo/JsonLd';

const inter = Inter({ subsets: ['latin'] });

const defaultUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.pmiikabbandung.org';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.pmiikabbandung.org'),
  title: {
    default: 'PMII Kab Bandung - Website Resmi PC PMII Kabupaten Bandung',
    template: '%s | PMII Kab Bandung',
  },
  description:
    'Website resmi PC PMII Kabupaten Bandung (PMII Kab Bandung). Pusat kaderisasi mahasiswa Islam, informasi pergerakan, arsip digital E-SAHABAT, dan layanan administrasi anggota se-Kabupaten Bandung.',
  keywords: [
    'PMII Kab Bandung',
    'PMII Kabupaten Bandung',
    'PC PMII Kab Bandung',
    'PC PMII Kabupaten Bandung',
    'PMII',
    'Pergerakan Mahasiswa Islam Indonesia Kabupaten Bandung',
    'E-SAHABAT PMII',
    'kaderisasi PMII Bandung',
    'MAPABA PMII Bandung',
    'PKD PMII Bandung',
    'organisasi mahasiswa bandung',
    'pmiikabbandung.org',
  ],
  authors: [{ name: 'PC PMII Kabupaten Bandung', url: 'https://www.pmiikabbandung.org' }],
  creator: 'PC PMII Kabupaten Bandung',
  publisher: 'PC PMII Kabupaten Bandung',
  alternates: {
    canonical: 'https://www.pmiikabbandung.org',
  },
  openGraph: {
    title: 'PMII Kab Bandung - Website Resmi PC PMII Kabupaten Bandung',
    description:
      'Website resmi PC PMII Kabupaten Bandung (PMII Kab Bandung). Pusat kaderisasi mahasiswa Islam, informasi pergerakan, arsip digital E-SAHABAT, dan basis anggota terpadu.',
    url: 'https://www.pmiikabbandung.org',
    siteName: 'PMII Kab Bandung',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/logo-wide.png',
        width: 1200,
        height: 630,
        alt: 'PMII Kab Bandung - PC PMII Kabupaten Bandung',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PMII Kab Bandung - Website Resmi PC PMII Kabupaten Bandung',
    description:
      'Portal resmi & administrasi digital PC PMII Kabupaten Bandung (PMII Kab Bandung).',
    images: ['/logo-wide.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <OrganizationJsonLd />
      </head>
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
