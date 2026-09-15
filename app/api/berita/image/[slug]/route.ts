import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = decodeURIComponent(params.slug);

    const berita = await prisma.berita.findUnique({
      where: { slug },
      select: { gambarSampul: true, judul: true },
    });

    if (berita?.gambarSampul) {
      const gambar = berita.gambarSampul.trim();

      // Kasus 1: Base64 data URL (data:image/jpeg;base64,...)
      if (gambar.startsWith('data:image/')) {
        const matches = gambar.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const contentType = matches[1];
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, 'base64');

          return new Response(buffer, {
            status: 200,
            headers: {
              'Content-Type': contentType,
              'Content-Length': buffer.length.toString(),
              'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
            },
          });
        }
      }

      // Kasus 2: URL eksternal (https://... atau http://...)
      if (gambar.startsWith('http://') || gambar.startsWith('https://')) {
        return NextResponse.redirect(gambar, 302);
      }

      // Kasus 3: Relatif path ke folder public (misal: /uploads/...)
      if (gambar.startsWith('/')) {
        const localFilePath = path.join(process.cwd(), 'public', gambar);
        if (fs.existsSync(localFilePath)) {
          const fileBuffer = fs.readFileSync(localFilePath);
          const ext = path.extname(localFilePath).toLowerCase();
          const mimeTypes: Record<string, string> = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.webp': 'image/webp',
            '.gif': 'image/gif',
          };
          const contentType = mimeTypes[ext] || 'image/jpeg';

          return new Response(fileBuffer, {
            status: 200,
            headers: {
              'Content-Type': contentType,
              'Content-Length': fileBuffer.length.toString(),
              'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
            },
          });
        }
      }
    }

    // Fallback: Tampilkan logo resmi organisasi
    const fallbackPath = path.join(process.cwd(), 'public', 'logo-wide.png');
    if (fs.existsSync(fallbackPath)) {
      const fallbackBuffer = fs.readFileSync(fallbackPath);
      return new Response(fallbackBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Content-Length': fallbackBuffer.length.toString(),
          'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
        },
      });
    }

    return new Response('Image not found', { status: 404 });
  } catch (error) {
    console.error('Error serving berita image:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
