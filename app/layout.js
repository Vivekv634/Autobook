import './globals.css';
import LayoutComponent from './LayoutComponent';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'AutoBook',
  description:
    'AutoBook is an advanced note taking application with auto-generated feature.',
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords: ['autobook', 'note taking app', 'notes app', 'advanced notes app'],
  authors: [
    {
      name: 'Vivek Vaish',
      url: 'https://www.github.com/Vivekv634',
    },
  ],
  openGraph: {
    title: 'AutoBook',
    description:
      'AutoBook is an advanced note-taking application with auto-generated notes.',
    url: 'https://autobook1.vercel.app',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AutoBook App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AutoBook',
    description:
      'AutoBook is an advanced note-taking application with auto-generated notes.',
    image: '/og-image.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className='scroll-smooth'
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="icon" href="/icons/favicon.ico" />
      </head>
      <body className={cn("selection:bg-fuchsia-300 selection:text-zinc-900")}>
        <LayoutComponent>{children}</LayoutComponent>
      </body>
    </html>
  );
}
