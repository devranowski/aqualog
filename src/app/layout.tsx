import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import localFont from 'next/font/local';
import '../styles/globals.css';
import '../styles/Aquarium.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SupabaseAuthProvider } from '@/components/providers/supabase-auth-provider';

const geistSans = localFont({
  src: '../fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
});

const geistMono = localFont({
  src: '../fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
});

export const metadata: Metadata = {
  title: 'Aqualog',
  description:
    'Dive into precision with Aqualog – your companion for tracking and perfecting aquarium water parameters.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SupabaseAuthProvider>
          {children}
          <Analytics />
          <SpeedInsights />
        </SupabaseAuthProvider>
      </body>
    </html>
  );
}
