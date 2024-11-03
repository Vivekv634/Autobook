import './globals.css';
import { Poppins } from 'next/font/google';
import LayoutComponent from './LayoutComponent';
import { cn } from '@/lib/utils';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

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
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={cn(poppins.className, 'scroll-smooth')}
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="icon" href="/icons/favicon.ico" />
        <meta name="theme-color" content="#90cdf4" />
      </head>
      <body className="selection:bg-fuchsia-300 selection:text-zinc-900">
        <LayoutComponent>{children}</LayoutComponent>
      </body>
    </html>
  );
}
