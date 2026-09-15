'use client';

import { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ShareButton({ slug, judul }: { slug: string; judul: string }) {
  const [copied, setCopied] = useState(false);

  const getShareData = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.pmiikabbandung.org';
    const url = `${origin}/berita/${slug}`;
    const text = `${judul}\n\nKlik untuk baca:\n${url}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    return { url, text, waUrl };
  };

  const handleWhatsAppShare = () => {
    const { waUrl } = getShareData();
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyOrShare = async () => {
    const { url, text } = getShareData();

    if (navigator.share) {
      try {
        await navigator.share({
          title: judul,
          text: `${judul}\n\nKlik untuk baca:\n`,
          url: url,
        });
        return;
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Share failed', err);
        }
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Tautan dan judul berita disalin!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Gagal menyalin tautan');
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      {/* Tombol Bagikan langsung ke WhatsApp seperti portal Kompas/Detik */}
      <button
        onClick={handleWhatsAppShare}
        type="button"
        title="Bagikan ke WhatsApp"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow transition-all duration-200 active:scale-95"
      >
        <svg
          className="w-4 h-4 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.477-.15-.678.15-.2.3-.778.98-.954 1.18-.175.2-.351.226-.652.076-.301-.15-1.272-.469-2.424-1.496-.896-.799-1.501-1.787-1.677-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.301-.502.1-.2.05-.376-.025-.527-.075-.15-.678-1.635-.93-2.242-.244-.593-.493-.513-.678-.522-.175-.009-.376-.01-.577-.01-.2 0-.527.075-.803.376s-1.054 1.03-1.054 2.511 1.079 2.912 1.23 3.113c.15.2 2.124 3.243 5.145 4.549.719.31 1.28.496 1.718.636.722.229 1.378.197 1.898.119.579-.087 1.78-.727 2.031-1.43.251-.703.251-1.305.176-1.43-.076-.126-.277-.201-.578-.352zm-5.467 7.618h-.005c-1.808 0-3.58-.487-5.127-1.408l-.368-.219-3.811 1 1.018-3.715-.24-.383c-1.012-1.61-1.547-3.479-1.547-5.398 0-5.513 4.486-10 10-10 2.67 0 5.18 1.04 7.069 2.93 1.888 1.89 2.928 4.4 2.928 7.07 0 5.514-4.486 10-10 10zm8.485-18.485c-2.266-2.268-5.28-3.515-8.485-3.515-6.617 0-12 5.383-12 12 0 2.112.551 4.175 1.597 5.996l-1.697 6.196 6.339-1.663c1.758.959 3.743 1.467 5.761 1.467h.005c6.617 0 12-5.383 12-12 0-3.205-1.247-6.218-3.52-8.481z" />
        </svg>
        <span>WhatsApp</span>
      </button>

      {/* Tombol Salin/Bagikan Lainnya */}
      <button
        onClick={handleCopyOrShare}
        type="button"
        title="Salin Tautan Berita"
        className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-xl transition-colors active:scale-95"
      >
        {copied ? (
          <>
            <Check size={14} className="text-emerald-500" />
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Tersalin</span>
          </>
        ) : (
          <>
            <Share2 size={14} />
            <span>Bagikan</span>
          </>
        )}
      </button>
    </div>
  );
}
