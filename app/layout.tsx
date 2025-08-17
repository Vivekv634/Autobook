import type { Metadata } from "next";
import "./globals.css";
import LayoutComponent from "./LayoutComponent";

export const metadata: Metadata = {
  title: "AutoBook",
  manifest: "../manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/favicon.ico" />
        <meta name="theme-color" content="#4A90E2" />
      </head>
      <body className="antialiased selection:bg-primary/50 selection:text-primary-foreground dark:selection:bg-primary/50 dark:selection:text-primary-foreground print:hidden">
        <LayoutComponent>{children}</LayoutComponent>
      </body>
    </html>
  );
}
