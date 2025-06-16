'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PaystackPayment from '@/components/payment/PaystackPayment';
import AuthModal from '@/components/auth/AuthModal';

export default function PaymentPage() {
  const { user, loading: authLoading } = useAuth();
  const { items, total } = useCart();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      setShowAuthModal(true);
    }
  }, [user, authLoading]);

  const handlePaymentSuccess = () => {
    router.push('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            asChild
            className="mb-6 hover:text-green-600"
          >
            <Link href="/" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>

          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-red-100 dark:bg-red-900/20 p-6 rounded-full mb-6">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
            <p className="text-muted-foreground mb-6 max-w-md">
              You need to sign in to access the payment page. Please create an account or sign in to continue.
            </p>
            <Button
              onClick={() => setShowAuthModal(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              Sign In / Sign Up
            </Button>
          </div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultTab="signin"
        />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            asChild
            className="mb-6 hover:text-green-600"
          >
            <Link href="/" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>

          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-yellow-100 dark:bg-yellow-900/20 p-6 rounded-full mb-6">
              <AlertCircle className="h-12 w-12 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Empty Cart</h1>
            <p className="text-muted-foreground mb-6 max-w-md">
              Your cart is empty. Please add some items to your cart before proceeding to payment.
            </p>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/#menu">Browse Menu</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          asChild
          className="mb-6 hover:text-green-600"
        >
          <Link href="/checkout" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Checkout
          </Link>
        </Button>

        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-green-600 mb-2">Payment</h1>
            <p className="text-muted-foreground">
              Complete your purchase securely with Paystack
            </p>
          </div>

          <PaystackPayment
            onSuccess={handlePaymentSuccess}
            onClose={() => router.push('/checkout')}
          />
        </div>
      </div>
    </div>
  );
}