'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Clock, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AuthModal from '@/components/auth/AuthModal';
import { ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS, formatOrderStatus } from '@/lib/orders';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function Orders() {
  const { user, loading: authLoading } = useAuth();
  const { userOrders, loading: ordersLoading } = useOrders();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      setShowAuthModal(true);
    }
  }, [user, authLoading]);

  if (authLoading || ordersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your orders...</p>
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

  const OrderDetailsModal = ({ order }: { order: any }) => (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Order Details - {order.id}
        </DialogTitle>
        <DialogDescription>
          Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Order Status */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Order Status</h3>
            <Badge className={ORDER_STATUS_COLORS[order.status as keyof typeof ORDER_STATUS_COLORS]}>
              {formatOrderStatus(order.status)}
            </Badge>
          </div>
          <div>
            <h3 className="font-semibold">Payment Status</h3>
            <Badge className={PAYMENT_STATUS_COLORS[order.paymentStatus as keyof typeof PAYMENT_STATUS_COLORS]}>
              {formatOrderStatus(order.paymentStatus)}
            </Badge>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h3 className="font-semibold mb-3">Items Ordered</h3>
          <div className="space-y-3">
            {order.items.map((item: any, index: number) => (
              <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    ₦{item.price.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₦{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center font-bold text-lg">
            <span>Total</span>
            <span className="text-green-600">₦{order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Delivery Information */}
        <div>
          <h3 className="font-semibold mb-2">Delivery Information</h3>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Method:</span> {formatOrderStatus(order.deliveryMethod)}</p>
            {order.deliveryAddress && (
              <p><span className="font-medium">Address:</span> {order.deliveryAddress}</p>
            )}
            <p><span className="font-medium">Payment Method:</span> {formatOrderStatus(order.paymentMethod)}</p>
            {order.paymentReference && (
              <p><span className="font-medium">Payment Reference:</span> {order.paymentReference}</p>
            )}
            {order.message && (
              <p><span className="font-medium">Message:</span> {order.message}</p>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  );

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

        {userOrders.length === 0 ? (
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
            {userOrders.map((order, index) => (
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
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={ORDER_STATUS_COLORS[order.status as keyof typeof ORDER_STATUS_COLORS]}>
                      {formatOrderStatus(order.status)}
                    </Badge>
                    <Badge className={PAYMENT_STATUS_COLORS[order.paymentStatus as keyof typeof PAYMENT_STATUS_COLORS]}>
                      {formatOrderStatus(order.paymentStatus)}
                    </Badge>
                    <span className="font-bold text-green-600">₦{order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Items ({order.items.length})</h4>
                      <div className="space-y-1">
                        {order.items.slice(0, 3).map((item, itemIndex) => (
                          <div key={itemIndex} className="flex justify-between text-sm">
                            <span>{item.name} x {item.quantity}</span>
                            <span>₦{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-sm text-muted-foreground">
                            +{order.items.length - 3} more items
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Delivery</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatOrderStatus(order.deliveryMethod)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Payment: {formatOrderStatus(order.paymentMethod)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <OrderDetailsModal order={order} />
                    </Dialog>
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