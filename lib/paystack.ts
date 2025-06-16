// Paystack configuration and utilities
export const PAYSTACK_PUBLIC_KEY = 'pk_test_f37ff43a7bc59161a830269c68d2243c605e3347';

// Note: Secret key should be stored in environment variables in production
// For this demo, we'll use it directly but in production use process.env.PAYSTACK_SECRET_KEY
export const PAYSTACK_SECRET_KEY = 'sk_test_12•••••a53'; // Replace with full key

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