// Paystack configuration and utilities from environment variables
export const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';

// Secret key from environment variables (server-side only)
export const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';

export interface PaystackTransactionData {
  email: string;
  amount: number; // Amount in kobo (multiply by 100)
  currency?: string;
  reference?: string;
  callback_url?: string;
  metadata?: {
    custom_fields?: Array<{
      display_name: string;
      variable_name: string;
      value: string;
    }>;
  };
}

export interface PaystackResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export const generateReference = (): string => {
  return `AGF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const formatAmountToKobo = (amount: number): number => {
  return Math.round(amount * 100);
};

export const formatAmountFromKobo = (amount: number): number => {
  return amount / 100;
};