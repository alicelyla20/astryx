import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Astryx",
  description: "Sistema ancla y segundo cerebro.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#09090b", // zinc-950
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark h-full antialiased">
      <body className={`${inter.className} min-h-screen bg-zinc-950 text-zinc-50 flex flex-col`}>
        <main className="flex-1 w-full max-w-md mx-auto min-h-screen bg-zinc-950 relative shadow-[0_0_40px_rgba(0,0,0,0.8)] border-x border-zinc-900/50">
          {children}
        </main>
      </body>
    </html>
  );
}
