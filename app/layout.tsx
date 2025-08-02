import type { Metadata } from "next";
import "./globals.css";
import LayoutComponent from "./LayoutComponent";
import { cn } from "@/lib/utils";
import {
  architects_daughter,
  dm_sans,
  fira_code,
  geist_mono,
  ibm_plex_mono,
  inter,
  jetbrains_mono,
  lora,
  noto_sans,
  open_sans,
  outfit,
  plus_jakarta_sans,
  poppins,
  roboto,
  roboto_mono,
  source_serif_4,
} from "@/public/fonts";

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
      <body
        className={cn(
          "antialiased selection:bg-primary/50 selection:text-primary-foreground dark:selection:bg-primary/50 dark:selection:text-primary-foreground",
          jetbrains_mono.className,
          source_serif_4.className,
          roboto.className,
          roboto_mono.className,
          noto_sans.className,
          plus_jakarta_sans.className,
          lora.className,
          geist_mono.className,
          fira_code.className,
          inter.className,
          architects_daughter.className,
          dm_sans.className,
          ibm_plex_mono.className,
          outfit.className,
          open_sans.className,
          poppins.className
        )}
      >
        <LayoutComponent>{children}</LayoutComponent>
      </body>
    </html>
  );
}
