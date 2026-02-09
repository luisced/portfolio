import type { Metadata } from "next";
import { Sora, Geist_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: '--font-sora',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['monospace'],
});

const pressStart2P = Press_Start_2P({
  variable: '--font-pixel',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  preload: false,
  fallback: ['monospace'],
});

export const metadata: Metadata = {
  title: "Luis Cedillo | Full-Stack Developer",
  description: "Portfolio of Luis Cedillo - Full-Stack Developer & Tech Lead",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${sora.variable} ${geistMono.variable} ${pressStart2P.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
