'use client';

import { Share2 } from 'lucide-react';

export default function ShareButton({ slug, judul }: { slug: string, judul: string }) {
  const handleShare = async () => {
    const url = `${window.location.origin}/berita/${slug}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: judul, url: url });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Tautan berita disalin ke clipboard!');
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors"
    >
      <Share2 size={18} />
      Bagikan Berita
    </button>
  );
}
