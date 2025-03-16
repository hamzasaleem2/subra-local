import { DatabaseSchema } from '../storage';

export const schema: DatabaseSchema = {
  preferences: {
    sortSubscriptionsBy: { type: 'string', required: true, default: 'dueDate' },
    defaultCurrency: { type: 'string', required: true, default: 'USD' },
    totalViewType: { type: 'string', required: true, default: 'monthly' },
    totalViewPeriod: { type: 'string', required: true, default: 'upcoming' },
  },

  currencies: {
    code: { type: 'string', required: true, index: true },
    name: { type: 'string', required: true },
    symbol: { type: 'string', required: true },
    isEnabled: { type: 'boolean', required: true },
  },

  subscriptions: {
    name: { type: 'string', required: true },
    description: { type: 'string', required: false },
    amount: { type: 'number', required: true },
    currency: { type: 'string', required: true },
    color: { type: 'string', required: false },
    icon: { type: 'string', required: false },
    categories: { type: 'array', required: true },
    billingCycle: {
      type: 'object',
      required: true,
      default: {
        frequency: 'monthly',
        startDate: Date.now(),
        duration: null,
      },
    },
  },

  exchangeRates: {
    timestamp: { type: 'number', required: true, index: true },
    rates: { type: 'object', required: true },
    base: { type: 'string', required: true },
  },
}; 