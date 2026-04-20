import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import AmbientGlow from '@/components/AmbientGlow';
import Cursor from '@/components/Cursor';
import ProductHuntBadge from '@/components/ProductHuntBadge';
import { MARKETPLACE_URL, SITE_NAME, SITE_URL } from '@/lib/links';
import './globals.css';

const DESCRIPTION =
  'Annotate screenshots on your clipboard before pasting them into AI chats like Claude, Copilot, and Cursor. Blur sensitive parts, add numbered steps, and resize large images automatically.';

const IS_PRODUCTION_DEPLOY =
  (process.env.CONTEXT ?? 'production') === 'production';

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Snapmark — Annotate screenshots before pasting them into AI chats',
    template: '%s · Snapmark',
  },
  description: DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  keywords: [
    'snapmark',
    'vscode extension',
    'screenshot annotation',
    'clipboard annotation',
    'ai chat',
    'claude code',
    'github copilot',
    'cursor',
    'codex',
    'gemini',
    'blur',
    'redact',
    'numbered callouts',
    'llm',
  ],
  authors: [{ name: 'Rajitha Disanayaka' }],
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'Snapmark — Annotate screenshots before pasting them into AI chats',
    description: DESCRIPTION,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Snapmark — annotate clipboard screenshots before pasting into AI chats',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Snapmark',
    description: DESCRIPTION,
    images: ['/og.png'],
  },
  robots: IS_PRODUCTION_DEPLOY
    ? { index: true, follow: true }
    : { index: false, follow: false },
  verification: {
    google: '0kLFsQAN6nkI0qvTBr-IK3kZXvTwz3k1uSMkbNKEXVo',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Snapmark',
  description: DESCRIPTION,
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Windows, macOS, Linux',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  downloadUrl: MARKETPLACE_URL,
  installUrl: MARKETPLACE_URL,
  softwareVersion: '1.0.0',
  url: SITE_URL,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <link
          rel="preload"
          as="image"
          href="/media/hero-poster.webp"
          type="image/webp"
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <AmbientGlow />
        {children}
        <ProductHuntBadge />
        <Cursor />
      </body>
    </html>
  );
}
