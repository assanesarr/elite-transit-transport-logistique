import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elite Transit Transport Logistique",
  description: "Elite Transit Transport Logistique est une entreprise de transport et de logistique spécialisée dans le transport de marchandises en Afrique de l'Ouest. Nous offrons des services de transport de qualité supérieure, fiables et abordables pour répondre aux besoins de nos clients.",
  manifest: "/manifest.json",
  // themeColor: "#000000",
};
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster richColors={true} position="top-right" />
      </body>
    </html>
  );
}
