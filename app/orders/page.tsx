'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AuthModal from '@/components/auth/AuthModal';

// Mock order data - in a real app, this would come from your database
const MOCK_ORDERS = [
  {
    id: 'ORD-001',
    date: '2025-01-15',
    status: 'delivered',
    total: 15500,
    items: [
      { name: 'Kilishi 250grams', quantity: 2, price: 7000 },
      { name: 'Palm oil 1litre', quantity: 1, price: 2500 }
    ],
    deliveryMethod: 'Pickup'
  },
  {
    id: 'ORD-002',
    date: '2025-01-10',
    status: 'processing',
    total: 8000,
    items: [
      { name: 'Ijebu Garri 2kg', quantity: 2, price: 4000 }
    ],
    deliveryMethod: 'Delivery'
  },
  {
    id: 'ORD-003',
    date: '2025-01-05',
    status: 'pending',
    total: 12000,
    items: [
      { name: 'Kilishi 500grams', quantity: 1, price: 14500 },
      { name: 'Suya spice 100grams', quantity: 1, price: 2500 }
    ],
    deliveryMethod: 'Pickup'
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'delivered':
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case 'processing':
      return <Clock className="h-5 w-5 text-yellow-600" />;
    case 'pending':
      return <AlertCircle className="h-5 w-5 text-orange-600" />;
    default:
      return <Package className="h-5 w-5 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    case 'processing':
      return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    case 'pending':
      return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
    default:
      return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
  }
};

export default function Orders() {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [orders, setOrders] = useState(MOCK_ORDERS);

  useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true);
    }
  }, [user, loading]);

  if (loading) {
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
            <div className="bg-green-100 dark:bg-green-900/20 p-6 rounded-full mb-6">
              <Package className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
            <p className="text-muted-foreground mb-6 max-w-md">
              You need to sign in to view your order history. Create an account or sign in to track your orders.
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

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-2">Order History</h1>
          <p className="text-muted-foreground">
            Track your orders and view your purchase history
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-green-100 dark:bg-green-900/20 p-6 rounded-full mb-6">
              <Package className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">No Orders Yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              You haven't placed any orders yet. Start shopping to see your order history here.
            </p>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/#menu">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-card rounded-lg shadow-md p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div className="flex items-center gap-3 mb-2 sm:mb-0">
                    <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                      <Package className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Order {order.id}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="font-bold text-green-600">₦{order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Items Ordered</h4>
                      <div className="space-y-1">
                        {order.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex justify-between text-sm">
                            <span>{item.name} x {item.quantity}</span>
                            <span>₦{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Delivery Method</h4>
                      <p className="text-sm text-muted-foreground">{order.deliveryMethod}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}