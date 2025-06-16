'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { PAYSTACK_PUBLIC_KEY, generateReference, formatAmountToKobo } from '@/lib/paystack';

interface PaystackPaymentProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: any) => {
        openIframe: () => void;
      };
    };
  }
}

export default function PaystackPayment({ onSuccess, onClose }: PaystackPaymentProps) {
  const { user, userProfile } = useAuth();
  const { items, total, clearCart } = useCart();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  // Load Paystack script on component mount
  useEffect(() => {
    const loadPaystackScript = () => {
      // Check if script is already loaded
      if (window.PaystackPop) {
        setScriptLoaded(true);
        return;
      }

      // Check if script tag already exists
      const existingScript = document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => setScriptLoaded(true));
        existingScript.addEventListener('error', () => setScriptError(true));
        return;
      }

      // Create and load script
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      
      script.onload = () => {
        console.log('Paystack script loaded successfully');
        setScriptLoaded(true);
      };
      
      script.onerror = () => {
        console.error('Failed to load Paystack script');
        setScriptError(true);
        toast({
          title: 'Payment Error',
          description: 'Failed to load payment system. Please check your internet connection.',
          variant: 'destructive',
        });
      };

      document.head.appendChild(script);
    };

    loadPaystackScript();
  }, [toast]);

  const handlePayment = async () => {
    if (!user || !userProfile) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to make a payment.',
        variant: 'destructive',
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: 'Empty Cart',
        description: 'Please add items to your cart before making payment.',
        variant: 'destructive',
      });
      return;
    }

    if (!scriptLoaded) {
      toast({
        title: 'Payment System Loading',
        description: 'Please wait for the payment system to load and try again.',
        variant: 'destructive',
      });
      return;
    }

    if (!window.PaystackPop) {
      toast({
        title: 'Payment Error',
        description: 'Payment system not available. Please refresh the page and try again.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      const reference = generateReference();
      const amountInKobo = formatAmountToKobo(total);

      console.log('Initializing payment with:', {
        email: user.email,
        amount: amountInKobo,
        reference,
      });

      const paystack = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount: amountInKobo,
        currency: 'NGN',
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: 'Customer Name',
              variable_name: 'customer_name',
              value: userProfile.displayName || 'Customer',
            },
            {
              display_name: 'Phone Number',
              variable_name: 'phone_number',
              value: userProfile.phone || 'Not provided',
            },
            {
              display_name: 'Order Items',
              variable_name: 'order_items',
              value: items.map(item => `${item.name} (${item.quantity})`).join(', '),
            },
          ],
        },
        callback: function(response: any) {
          console.log('Payment callback:', response);
          setIsProcessing(false);
          if (response.status === 'success') {
            handlePaymentSuccess(response);
          } else {
            toast({
              title: 'Payment Failed',
              description: 'Your payment was not successful. Please try again.',
              variant: 'destructive',
            });
          }
        },
        onClose: function() {
          console.log('Payment popup closed');
          setIsProcessing(false);
          if (!paymentSuccess) {
            toast({
              title: 'Payment Cancelled',
              description: 'You cancelled the payment process.',
            });
          }
        },
      });

      // Open the payment popup
      paystack.openIframe();
    } catch (error) {
      setIsProcessing(false);
      console.error('Payment error:', error);
      toast({
        title: 'Payment Error',
        description: 'An error occurred while processing your payment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handlePaymentSuccess = async (response: any) => {
    try {
      console.log('Payment successful:', response);
      
      setPaymentSuccess(true);
      
      toast({
        title: 'Payment Successful! 🎉',
        description: `Your payment of ₦${total.toFixed(2)} has been processed successfully.`,
        duration: 5000,
      });

      // Clear the cart after successful payment
      setTimeout(() => {
        clearCart();
        setPaymentSuccess(false);
        onSuccess?.();
      }, 3000);

    } catch (error) {
      console.error('Error handling payment success:', error);
      toast({
        title: 'Payment Verification Error',
        description: 'Payment was successful but verification failed. Please contact support.',
        variant: 'destructive',
      });
    }
  };

  if (paymentSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-green-100 dark:bg-green-900/20 p-6 rounded-full mb-6">
          <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
          Payment Successful!
        </h2>
        <p className="text-muted-foreground mb-4">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        <p className="text-sm text-muted-foreground">
          Redirecting you shortly...
        </p>
      </div>
    );
  }

  if (scriptError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-red-100 dark:bg-red-900/20 p-6 rounded-full mb-6">
          <AlertCircle className="h-16 w-16 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
          Payment System Error
        </h2>
        <p className="text-muted-foreground mb-4">
          Unable to load the payment system. Please check your internet connection and try again.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Refresh Page
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <CreditCard className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Secure Payment</h2>
        <p className="text-muted-foreground">
          Complete your purchase securely with Paystack
        </p>
      </div>

      <div className="bg-card p-6 rounded-lg border">
        <h3 className="font-semibold mb-4">Order Summary</h3>
        <div className="space-y-2 mb-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.name} x {item.quantity}</span>
              <span>₦{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-green-600">₦{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-green-600" />
          <span className="font-medium text-green-600">Secure Payment</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Your payment is secured by Paystack's industry-leading encryption and fraud protection.
        </p>
      </div>

      <div className="space-y-3">
        <Button
          onClick={handlePayment}
          disabled={isProcessing || !user || items.length === 0 || !scriptLoaded}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Processing Payment...
            </>
          ) : !scriptLoaded ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading Payment System...
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5 mr-2" />
              Pay ₦{total.toFixed(2)} with Paystack
            </>
          )}
        </Button>

        {onClose && (
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
            className="w-full"
          >
            Cancel
          </Button>
        )}
      </div>

      {!user && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            Please sign in to make a payment.
          </p>
        </div>
      )}

      {!scriptLoaded && !scriptError && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Loading payment system... Please wait.
          </p>
        </div>
      )}
    </div>
  );
}