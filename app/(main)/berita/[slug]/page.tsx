import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { Calendar, User, ArrowLeft, Eye } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import ShareButton from './ShareButton';
import { headers } from 'next/headers';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const berita = await prisma.berita.findUnique({
    where: { slug: params.slug },
  });

  if (!berita) return {};

  let baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) {
    try {
      const headersList = headers();
      const host = headersList.get('x-forwarded-host') || headersList.get('host');
      const proto = headersList.get('x-forwarded-proto') || 'https';
      if (host) {
        baseUrl = `${proto}://${host}`;
      }
    } catch {
      // ignore
    }
  }
  if (!baseUrl) {
    baseUrl = 'https://www.pmiikabbandung.org';
  }

  // Gunakan endpoint gambar yang selalu menyajikan binary file (bukan Base64 data URL)
  // dengan ekstensi .jpg agar dikenali sebagai gambar oleh WhatsApp, Telegram, Facebook, dan Twitter crawler.
  let imageUrl = `${baseUrl}/api/berita/image/${encodeURIComponent(berita.slug)}.jpg`;

  // Jika gambarSampul sudah berupa URL eksternal langsung (http/https), gunakan langsung tanpa redirect 302
  if (berita.gambarSampul) {
    const trimmed = berita.gambarSampul.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      imageUrl = trimmed;
    }
  }

  return {
    title: `${berita.judul} | PMII Kab Bandung`,
    description: berita.ringkasan || 'Berita dan Informasi Seputar PC PMII Kabupaten Bandung',
    openGraph: {
      title: berita.judul,
      description: berita.ringkasan || 'Berita dan Informasi Seputar PC PMII Kabupaten Bandung',
      url: `${baseUrl}/berita/${berita.slug}`,
      siteName: 'PMII Kab Bandung',
      locale: 'id_ID',
      images: [
        {
          url: imageUrl,
          secureUrl: imageUrl,
          width: 1200,
          height: 630,
          type: 'image/jpeg',
          alt: berita.judul,
        },
      ],
      type: 'article',
      publishedTime: (berita.publishedAt || berita.createdAt).toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: berita.judul,
      description: berita.ringkasan || 'Berita dan Informasi Seputar PC PMII Kabupaten Bandung',
      images: [imageUrl],
    },
  };
}

export default async function BacaBeritaPage({ params }: { params: { slug: string } }) {
  const berita = await prisma.berita.findUnique({
    where: { slug: params.slug },
    include: { author: true }
  });

  if (!berita || !berita.isPublished) {
    notFound();
  }

  // Catatan: Secara ideal, untuk menambah viewCount, kita harus menggunakan rute API terpisah yang dipanggil dari useEffect.
  // Untuk prototipe awal ini, viewCount dibiarkan statis.

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-28 pb-20">
      <div className="container-custom max-w-4xl mx-auto px-4 md:px-0">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary-600 mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Kembali ke Beranda
        </Link>
        
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
          {berita.gambarSampul && (
            <div className="w-full h-[250px] md:h-[450px] relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={berita.gambarSampul} alt={berita.judul} className="w-full h-full object-cover" />
            </div>
          )}
          
          <div className="p-6 md:p-12">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="badge badge-blue font-bold px-3 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 rounded-full">{berita.kategori}</span>
                <span className="flex items-center gap-1.5"><Calendar size={16} /> {formatDate(berita.publishedAt || berita.createdAt)}</span>
                <span className="flex items-center gap-1.5"><User size={16} /> Ditulis oleh: {berita.author?.name || 'Administrator'}</span>
              </div>
              <ShareButton slug={berita.slug} judul={berita.judul} />
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-10">
              {berita.judul}
            </h1>
            
            {/* Render konten HTML langsung dari format React Quill */}
            <div 
              className="prose prose-lg md:prose-xl dark:prose-invert max-w-none 
                         prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                         prose-a:text-primary-600 hover:prose-a:text-primary-700
                         prose-img:rounded-2xl prose-img:shadow-md
                         text-justify prose-p:text-justify"
              dangerouslySetInnerHTML={{ __html: berita.konten }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
