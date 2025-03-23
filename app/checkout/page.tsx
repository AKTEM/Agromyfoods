'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Minus, Trash2, MapPin, Receipt, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import emailjs from '@emailjs/browser';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';

// EmailJS credentials
const EMAILJS_SERVICE_ID = 'service_d1zg27c';
const EMAILJS_TEMPLATE_ID = 'template_xyu4tjl';
const EMAILJS_PUBLIC_KEY = 'bsfiqrl3PMvQYGnet';

const PICKUP_ADDRESS = [
  '(1)No 2, Agbeke Close, Obadeyi-Ijaiye Area, Lagos - (2)No 24, Oyinkan Abayomi Drive, Federal High Court, Ikoyi, Lagos'
];

export default function Checkout() {
  const { items, total, clearCart, updateQuantity, removeItem } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBankTransfer, setShowBankTransfer] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  // Add useEffect to scroll to top when bank transfer view is shown
  useEffect(() => {
    if (showBankTransfer) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showBankTransfer]);

  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: '',
      email: '',
      phone: '',
      address: '',
    };

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    // Phone validation
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^[0-9+\s()-]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
      isValid = false;
    }

    // Address validation (only required for bank transfer/delivery)
    if (showBankTransfer && !formData.address.trim()) {
      errors.address = 'Address is required for delivery';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleQuantityChange = (id: string, change: number, currentQuantity: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id);
    toast({
      title: 'Item Removed',
      description: `${name} has been removed from your cart.`,
    });
  };

  const formatOrderForEmail = () => {
    // Create a detailed HTML table for the email
    const itemsTable = `
      <table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%;">
        <tr style="background-color: #f2f2f2;">
          <th style="text-align: left;">Item</th>
          <th style="text-align: center;">Quantity</th>
          <th style="text-align: right;">Price</th>
          <th style="text-align: right;">Subtotal</th>
        </tr>
        ${items.map(item => `
          <tr>
            <td style="text-align: left;">${item.name}</td>
            <td style="text-align: center;">${item.quantity}</td>
            <td style="text-align: right;">₦${item.price.toFixed(2)}</td>
            <td style="text-align: right;">₦${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `).join('')}
        <tr style="font-weight: bold; background-color: #f2f2f2;">
          <td colspan="3" style="text-align: right;">Total:</td>
          <td style="text-align: right;">₦${total.toFixed(2)}</td>
        </tr>
      </table>
    `;

    // Create a text-only version as backup
    const itemsText = items
      .map(item => `${item.name} (${item.quantity} x ₦${item.price.toFixed(2)} = ₦${(item.price * item.quantity).toFixed(2)})`)
      .join('\n');

    return {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address || 'No address provided',
      message: formData.message || 'No message provided',
      order_details_html: itemsTable,
      order_details_text: itemsText,
      total_price: `₦${total.toFixed(2)}`,
      items_count: items.length,
      delivery_method: showBankTransfer ? 'Delivery (Bank Transfer)' : 'Pickup',
      delivery_address: showBankTransfer ? formData.address : PICKUP_ADDRESS,
      order_date: new Date().toLocaleString(),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Please fill all required fields',
        description: 'All fields marked with * are required',
        variant: 'destructive',
      });
      return;
    }
    
    setShowConfirmation(true);
  };

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);
    try {
      const emailData = formatOrderForEmail();
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        emailData,
        EMAILJS_PUBLIC_KEY
      );

      if (response.status === 200) {
        setShowConfirmation(false);
        setOrderSuccess(true);
        toast({
          title: 'Order Placed Successfully!',
          description: showBankTransfer 
            ? 'Thank you for your order. We will contact you shortly.'
            : 'Thank you for your order. You can pick up your order at our location.',
          variant: 'default',
        });
        clearCart();
        // Don't redirect immediately to allow user to see the success message
        setTimeout(() => {
          window.location.href = '/';
        }, 5000);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error placing your order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const OrderConfirmation = () => (
    <Sheet open={showConfirmation} onOpenChange={setShowConfirmation}>
      <SheetContent className="sm:max-w-[600px] overflow-y-auto flex flex-col h-full">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Order Confirmation
          </SheetTitle>
          <SheetDescription>
            Please review your order details before confirming
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6 flex-grow overflow-y-auto">
          <div>
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <div className="space-y-2 max-h-[30vh] overflow-y-auto border rounded-md p-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₦{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₦{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Personal Details</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Name:</span> {formData.name}</p>
              <p><span className="font-medium">Email:</span> {formData.email}</p>
              <p><span className="font-medium">Phone:</span> {formData.phone}</p>
              <p><span className="font-medium">Address:</span> {formData.address || 'Not provided'}</p>
              {formData.message && (
                <p><span className="font-medium">Message:</span> {formData.message}</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Delivery Method</h3>
            <p className="text-sm">
              {showBankTransfer ? 'Delivery (Bank Transfer)' : 'Pickup'}
            </p>
            {!showBankTransfer && (
              <p className="text-sm mt-1">
                <span className="font-medium">Pickup Address:</span> {PICKUP_ADDRESS}
              </p>
            )}
          </div>
        </div>

        <SheetFooter className="mt-6 flex-shrink-0 pb-4">
          <Button
            variant="outline"
            onClick={() => setShowConfirmation(false)}
            disabled={isSubmitting}
          >
            Edit Order
          </Button>
          <Button
            onClick={handleConfirmOrder}
            className="bg-green-600 hover:bg-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Send Order'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );

  const OrderSuccess = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-card p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <div className="mb-4 text-green-600 flex justify-center">
          <CheckCircle className="h-16 w-16" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your Order has been Sent!</h2>
        <p className="text-muted-foreground mb-6">
          {showBankTransfer 
            ? 'Your order has been sent. We will Confirm your Order and Payment Very SOON.'
            : 'Your order has been received. You can pick up your order at our location.'}
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          A confirmation has been sent to your email.
        </p>
        <Button 
          className="w-full bg-green-600 hover:bg-green-700"
          onClick={() => window.location.href = '/'}
        >
          Return to Home
        </Button>
      </div>
    </div>
  );

  if (orderSuccess) {
    return <OrderSuccess />;
  }

  if (showBankTransfer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => setShowBankTransfer(false)}
          className="mb-6 hover:text-green-600"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Checkout
        </Button>

        <div className="max-w-2xl mx-auto bg-card p-8 rounded-lg shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-green-600">Bank Transfer Details</h2>
            <img
              src="img/Monie.jpg"
              alt="Moniepoint"
              className="h-8"
            />
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
            <p className="text-lg mb-4">Kindly make payment to:</p>
            <div className="space-y-2">
              <p><strong>Bank:</strong> Moniepoint</p>
              <p><strong>Account Number:</strong> 6978864999</p>
              <p><strong>Account Name:</strong> Agromy Foods</p>
              <p><strong>Amount:</strong> ₦{total.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={formErrors.name ? "border-red-500" : ""}
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
              )}
            </div>
            
            <div>
              <label className="block mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={formErrors.email ? "border-red-500" : ""}
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>
            
            <div>
              <label className="block mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={formErrors.phone ? "border-red-500" : ""}
              />
              {formErrors.phone && (
                <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
              )}
            </div>

            <div>
              <label className="block mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={formErrors.address ? "border-red-500" : ""}
                placeholder="Enter your delivery address"
              />
              {formErrors.address && (
                <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
              )}
            </div>

            <div>
              <label className="block mb-2">Message (Optional)</label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Add any special instructions or notes for your order..."
              />
            </div>
          </div>
          
          <Button
            onClick={handleSubmit}
            className="w-full bg-green-600 hover:bg-green-700 mb-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Proceed with Order'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            You'll receive order confirmation through via Whatsapp, Call or Sms from s hortly.
          </p>
        </div>
        <OrderConfirmation />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
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

      <h1 className="text-3xl font-bold mb-8 text-green-600">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-lg shadow max-h-[70vh] md:max-h-none overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 sticky top-0 bg-card pt-1 pb-2 z-10">Order Summary</h2>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-full mb-4">
                <AlertCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-4">Add some delicious items to your cart first!</p>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/#menu">Browse Menu</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4 border-b">
                  <div className="flex items-center gap-4 flex-1">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">₦{item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.id, -1, item.quantity)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.id, 1, item.quantity)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="font-medium w-24 text-right">
                      ₦{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveItem(item.id, item.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 pt-4 border-t sticky bottom-0 bg-card pb-1">
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total</span>
              <span className="text-green-600">₦{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={formErrors.name ? "border-red-500" : ""}
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
            )}
          </div>
          
          <div>
            <label className="block mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={formErrors.email ? "border-red-500" : ""}
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
            )}
          </div>
          
          <div>
            <label className="block mb-2">
              Phone <span className="text-red-500">*</span>
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={formErrors.phone ? "border-red-500" : ""}
            />
            {formErrors.phone && (
              <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
            )}
          </div>

          <div>
            <label className="block mb-2">Address</label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter your address"
            />
          </div>

          <div>
            <label className="block mb-2">Message (Optional)</label>
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Add any special instructions or notes for your order..."
            />
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <h3 className="font-medium text-green-600">Pickup Location</h3>
                <p className="text-sm text-muted-foreground">{PICKUP_ADDRESS}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              type="button"
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => setShowBankTransfer(true)}
              disabled={items.length === 0}
            >
              Delivery (Bank Transfer)
            </Button>
            
            <div className="space-y-4">
              <Button
                type="submit"
                variant="outline"
                className="w-full border-green-600 text-green-600 hover:bg-green-50"
                disabled={items.length === 0 || isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Pickup Order'}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                You'll receive Your Order & Payment Confirmation via Whatsapp, SMS or Call, very Soon.
              </p>
            </div>
          </div>
        </form>
      </div>

      {/* Fixed bottom checkout bar for mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex justify-between items-center z-20">
        <div>
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="font-bold text-green-600">₦{total.toFixed(2)}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-green-600 text-green-600"
            onClick={() => setShowBankTransfer(true)}
            disabled={items.length === 0}
          >
            Delivery
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={handleSubmit}
            disabled={items.length === 0 || isSubmitting}
          >
            Pickup
          </Button>
        </div>
      </div>
      
      <OrderConfirmation />
    </div>
  );
}