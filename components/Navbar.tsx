'use client';

import { ShoppingCart, Sun, Moon, Menu, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useCart } from '@/context/CartContext';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { setTheme, theme } = useTheme();
  const { items, total } = useCart();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close cart sheet when on checkout page
  useEffect(() => {
    if (pathname === '/checkout') {
      setIsCartOpen(false);
    }
    // Close mobile menu when pathname changes
    setIsMenuOpen(false);
  }, [pathname]);

  const menuItems = [
    { href: '/', label: 'Home' },
    { href: '/#menu', label: 'Shop' },
    { href: '/blog', label: 'Blog' },
    { href: '/#about', label: 'About' },
    { href: '/#contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
      <Image src="img/AGROMYfood-logo.png" alt="FoodHub Logo" width={90} height={50} />
    </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-foreground hover:text-green-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-foreground hover:text-green-600"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            )}

            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {items.length > 0 && (
                    <span className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                      {items.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="flex flex-col h-full">
                <SheetHeader className="flex-shrink-0">
                  <SheetTitle>Your Cart</SheetTitle>
                  <SheetDescription>
                    Total: ₦{total.toFixed(2)}
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4 flex-1 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2 border-b"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ₦{item.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">₦{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                {items.length > 0 && (
                  <SheetFooter className="mt-auto pt-4 pb-2 border-t flex-shrink-0">
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700" 
                      asChild
                      onClick={() => setIsCartOpen(false)}
                    >
                      <Link href="/checkout">Proceed to Checkout</Link>
                    </Button>
                  </SheetFooter>
                )}
              </SheetContent>
            </Sheet>

            {/* Mobile Menu Button */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full">
                  {/* Navigation Links */}
                  <nav className="flex flex-col gap-4 mt-8">
                    {menuItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="text-lg font-medium hover:text-green-600 transition-colors px-4 py-2 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}