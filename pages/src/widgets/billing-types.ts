export type Subscription = {
  plan: string;
  price: string;
  interval?: string;
  nextBillingDate?: string;
  status?: string;
  usage?: Array<{ label: string; value: string }>;
};
export type PaymentMethod = {
  brand: string;
  last4: string;
  expiresAt?: string;
};
export type Invoice = {
  id: string;
  date: string;
  amount: string;
  status: string;
  href?: string;
};
export type PricingPlan = {
  name: string;
  price: string;
  description?: string;
  features: string[];
  highlighted?: boolean;
};
