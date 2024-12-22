'use client';
import { ThemeProvider } from '@/app/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Provider } from 'react-redux';
import './globals.css';
import { store } from './redux/store';
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
