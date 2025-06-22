'use client';

import { ShoppingCart, Sun, Moon, Menu, X, Search, User, Shield, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import AuthModal from '@/components/auth/AuthModal';
import UserProfile from '@/components/auth/UserProfile';

// Admin emails from environment variables
const getAdminEmails = (): string[] => {
  const adminEmailsEnv = process.env.ADMIN_EMAILS || 'admin@agromyfoods.com,info@agromyfoods.com';
  return adminEmailsEnv.split(',').map(email => email.trim());
};

export default function Navbar() {
  const { setTheme, theme } = useTheme();
  const { items, total } = useCart();
  const { user, userProfile, loading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');
  const [isMobileAuthOpen, setIsMobileAuthOpen] = useState(false);
  const pathname = usePathname();

  const ADMIN_EMAILS = getAdminEmails();
  const isAdmin = user && ADMIN_EMAILS.includes(user.email || '');

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

  const handleAuthClick = (tab: 'signin' | 'signup') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
    setIsMobileAuthOpen(false);
  };

  return (
    <>
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

            <div className="flex items-center space-x-2">
              {/* Desktop Theme Toggle */}
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="hidden md:flex text-foreground hover:text-green-600"
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              )}

              {/* Desktop Auth Section */}
              {!authLoading && (
                <>
                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="hidden md:flex items-center gap-2">
                          <div className="bg-green-100 dark:bg-green-800 w-8 h-8 rounded-full flex items-center justify-center">
                            {isAdmin ? (
                              <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                            ) : (
                              <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                            )}
                          </div>
                          <span className="hidden lg:inline text-sm">
                            {userProfile?.displayName || user.email?.split('@')[0]}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
                          My Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/orders">Order History</Link>
                        </DropdownMenuItem>
                        {isAdmin && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href="/admin" className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Admin Dashboard
                              </Link>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <div className="hidden md:flex items-center gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => handleAuthClick('signin')}
                        className="text-green-600 hover:text-green-700"
                      >
                        Sign In
                      </Button>
                      <Button
                        onClick={() => handleAuthClick('signup')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Sign Up
                      </Button>
                    </div>
                  )}
                </>
              )}

              {/* Desktop Cart */}
              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="hidden md:flex relative">
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

              {/* Mobile Icons Group */}
              <div className="md:hidden flex items-center space-x-1">
                {/* Mobile Theme Toggle */}
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

                {/* Mobile Auth Icon */}
                {!authLoading && !user && (
                  <Popover open={isMobileAuthOpen} onOpenChange={setIsMobileAuthOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-foreground hover:text-green-600">
                        <UserPlus className="h-5 w-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2" align="end">
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="ghost"
                          onClick={() => handleAuthClick('signin')}
                          className="justify-start text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Sign In
                        </Button>
                        <Button
                          onClick={() => handleAuthClick('signup')}
                          className="justify-start bg-green-600 hover:bg-green-700"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Sign Up
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}

                {/* Mobile User Icon (when logged in) */}
                {!authLoading && user && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsProfileOpen(true)}
                    className="text-foreground hover:text-green-600"
                  >
                    <div className="bg-green-100 dark:bg-green-800 w-6 h-6 rounded-full flex items-center justify-center">
                      {isAdmin ? (
                        <Shield className="h-3 w-3 text-green-600 dark:text-green-400" />
                      ) : (
                        <User className="h-3 w-3 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                  </Button>
                )}

                {/* Mobile Cart */}
                <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative text-foreground hover:text-green-600">
                      <ShoppingCart className="h-5 w-5" />
                      {items.length > 0 && (
                        <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
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
                    <Button variant="ghost" size="icon" className="text-foreground hover:text-green-600">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <SheetHeader>
                      <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col h-full">
                      {/* User Info for Mobile */}
                      {user && (
                        <div className="flex items-center gap-3 mt-4 pb-4 border-b">
                          <div className="bg-green-100 dark:bg-green-800 w-10 h-10 rounded-full flex items-center justify-center">
                            {isAdmin ? (
                              <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                            ) : (
                              <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{userProfile?.displayName || 'User'}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      )}

                      {/* Navigation Links */}
                      <nav className="flex flex-col gap-4 mt-4">
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
                        
                        {user && (
                          <>
                            <button
                              onClick={() => {
                                setIsProfileOpen(true);
                                setIsMenuOpen(false);
                              }}
                              className="text-lg font-medium hover:text-green-600 transition-colors px-4 py-2 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 text-left"
                            >
                              My Profile
                            </button>
                            <Link
                              href="/orders"
                              className="text-lg font-medium hover:text-green-600 transition-colors px-4 py-2 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              Order History
                            </Link>
                            {isAdmin && (
                              <Link
                                href="/admin"
                                className="text-lg font-medium hover:text-green-600 transition-colors px-4 py-2 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <Shield className="h-4 w-4" />
                                Admin Dashboard
                              </Link>
                            )}
                          </>
                        )}
                      </nav>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
      />

      {/* User Profile Modal */}
      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}