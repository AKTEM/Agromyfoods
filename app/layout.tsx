'use client';

import './globals.css';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/Navbar';
import { CartProvider } from '@/context/CartContext';

// Load Inter font with a subset of weights to improve performance
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Website Metadata */}
        <title>Food items Order and Delivery</title>
        <meta name="description" content="Order Packaged food items and get them delivered fast Nationwide ,Nigeria." />
        <meta name="keywords" content="Packaged food items delivery" />
        <meta name="author" content="Agromyfoods" />

        {/* Open Graph Metadata for Social Media */}
        <meta property="og:title" content="Food items Order and Delivery" />
        <meta property="og:description" content="Fast food delivery service in Lagos." />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:url" content="https://www.agromyfoods.com" />

        {/* Favicon */}
        <link rel="icon" href="img/AGROMYfood-logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

        {/* Responsive Meta Tag */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <div className="min-h-screen bg-background">
              <Navbar />
              <main>{children}</main>
              <Toaster />
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
