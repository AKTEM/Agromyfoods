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
        <title>Order Packaged Nigerian Food Items Online | Fast Delivery</title>
        <meta 
          name="Agromyfoods offers a wide selection of premium packaged Nigerian food items, including Kilishi (beef jerky), Ijebu Garri, natural spices, and authentic palm oil. Order online for fast and reliable delivery nationwide across Nigeria. Enjoy fresh, high-quality traditional Nigerian delicacies delivered straight to your door." 
          content="Order premium Nigerian packaged food items like Kilishi (Beef Jerky), Ijebu Garri, natural spices, and palm oil. Fast delivery across Nigeria." 
        />
        <meta 
          name="keywords" 
          content="order packaged Nigerian food, Kilishi, Ijebu Garri, natural spices, premium palm oil, Nigerian snacks, food delivery, buy Kilishi online, fast food delivery Nigeria, traditional Nigerian food, packaged food Nigeria, Nigerian delicacies, authentic Nigerian spices, food delivery Lagos, Nigerian beef jerky" 
        />
        <meta name="author" content="Agromyfoods" />
        
        {/* Open Graph Metadata for Social Media */}
        <meta property="og:title" content="Order Packaged Nigerian Food Items | Kilishi, Ijebu Garri, Spices & Palm Oil" />
        <meta 
          property="og:description" 
          content="Agromyfoods offers a wide range of packaged Nigerian food items including Kilishi, Ijebu Garri, authentic spices, and premium palm oil. Order online with fast delivery nationwide." 
        />
        <meta 
          property="og:image" 
          content="https://www.agromyfoods.com/img/AGROMYfood-logo.png" 
        />
        <meta property="og:url" content="https://www.agromyfoods.com" />
        
        {/* Twitter Card Metadata */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Order Packaged Nigerian Food Items | Kilishi, Ijebu Garri, Spices & Palm Oil" />
        <meta 
          name="twitter:description" 
          content="Shop for Kilishi, Ijebu Garri, spices, and premium palm oil on Agromyfoods. Order now for fast and reliable delivery across Nigeria." 
        />
        <meta 
          name="twitter:image" 
          content="https://www.agromyfoods.com/img/AGROMYfood-logo.png" 
        />
        
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
