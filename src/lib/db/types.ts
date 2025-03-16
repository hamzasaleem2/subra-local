import { Document } from '../storage';

export interface Preferences extends Document {
  sortSubscriptionsBy: string;
  defaultCurrency: string;
  totalViewType: string;
  totalViewPeriod: string;
}

export interface Currency extends Document {
  code: string;
  name: string;
  symbol: string;
  isEnabled: boolean;
}

export interface BillingCycle {
  frequency: string;
  startDate: number;
  duration?: number;
}

export interface Subscription extends Document {
  name: string;
  description?: string;
  amount: number;
  currency: string;
  color?: string;
  icon?: string;
  categories: string[];
  billingCycle: BillingCycle;
}

export interface SubscriptionWithExtras extends Omit<Subscription, 'id'> {
  _id: string;
  nextPayment: {
    dueDate: number;
    isLastPayment: boolean;
  };
}

export interface ExchangeRates extends Document {
  timestamp: number;
  rates: Record<string, number>;
  base: string;
} 