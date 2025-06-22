'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { collection, addDoc, query, where, orderBy, onSnapshot, doc, updateDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order, OrderItem, OrderStats, generateOrderId } from '@/lib/orders';

interface OrderContextType {
  orders: Order[];
  userOrders: Order[];
  orderStats: OrderStats;
  loading: boolean;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  updatePaymentStatus: (orderId: string, status: Order['paymentStatus'], reference?: string) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    thisWeekOrders: 0,
    thisMonthOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  // Listen to all orders (for admin)
  useEffect(() => {
    const ordersQuery = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Order[];

      setOrders(ordersData);
      calculateOrderStats(ordersData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Listen to user orders - Modified to avoid composite index requirement
  useEffect(() => {
    if (!user) {
      setUserOrders([]);
      return;
    }

    // Use only where clause without orderBy to avoid composite index requirement
    const userOrdersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(userOrdersQuery, (snapshot) => {
      const userOrdersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Order[];

      // Sort the orders client-side by createdAt in descending order
      const sortedUserOrders = userOrdersData.sort((a, b) => 
        b.createdAt.getTime() - a.createdAt.getTime()
      );

      setUserOrders(sortedUserOrders);
    });

    return unsubscribe;
  }, [user]);

  const calculateOrderStats = (ordersData: Order[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats: OrderStats = {
      totalOrders: ordersData.length,
      pendingOrders: ordersData.filter(order => order.status === 'pending').length,
      completedOrders: ordersData.filter(order => order.status === 'delivered').length,
      totalRevenue: ordersData
        .filter(order => order.paymentStatus === 'paid')
        .reduce((sum, order) => sum + order.total, 0),
      todayOrders: ordersData.filter(order => order.createdAt >= today).length,
      thisWeekOrders: ordersData.filter(order => order.createdAt >= thisWeek).length,
      thisMonthOrders: ordersData.filter(order => order.createdAt >= thisMonth).length,
    };

    setOrderStats(stats);
  };

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const orderId = generateOrderId();
      const now = new Date();
      
      const order: Omit<Order, 'id'> = {
        ...orderData,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, 'orders'), order);
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  const updatePaymentStatus = async (
    orderId: string, 
    status: Order['paymentStatus'], 
    reference?: string
  ): Promise<void> => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const updateData: any = {
        paymentStatus: status,
        updatedAt: new Date(),
      };
      
      if (reference) {
        updateData.paymentReference = reference;
      }

      await updateDoc(orderRef, updateData);
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  const value = {
    orders,
    userOrders,
    orderStats,
    loading,
    createOrder,
    updateOrderStatus,
    updatePaymentStatus,
    getOrderById,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}