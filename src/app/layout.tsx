import { Inter } from 'next/font/google';

import type { Metadata } from 'next';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Further Integration Specialist Exercise',
  description: 'Submission for take home assignment',
};


const RootLayout = ({children} : Readonly<{
  children: React.ReactNode;
}>) => (
  <html lang="en">
    <body className={inter.className}>{children}</body>
  </html>
);

export default RootLayout
