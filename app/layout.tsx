import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ConditionalLayout from '@/components/ConditionalLayout';
import AutoLogout from '@/components/AutoLogout';
import VisitorTracker from '@/components/VisitorTracker';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RBLC ltd - Car Spare Parts Marketplace',
  description: 'Your trusted partner for car spare parts in Rwanda. Quality parts, fast delivery, reliable service.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AutoLogout />
        <VisitorTracker />
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
