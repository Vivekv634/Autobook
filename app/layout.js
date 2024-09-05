'use client';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ThemeProvider } from '@/app/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#90cdf4" />
      </head>
      <body>
        <Provider store={store}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SpeedInsights />
            {children}
          </ThemeProvider>
        </Provider>
        <Toaster />
      </body>
    </html>
  );
}
