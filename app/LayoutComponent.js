'use client';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ThemeProvider } from '@/app/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

export default function LayoutComponent({ children }) {
  return (
    <>
      <Provider store={store}>
        <ThemeProvider forcedTheme="dark" attribute="class" enableSystem={true}>
          <SpeedInsights />
          <Analytics />
          {children}
        </ThemeProvider>
      </Provider>
      <Toaster />
    </>
  );
}
