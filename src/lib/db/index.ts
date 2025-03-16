import { Database } from '../storage';
import { schema } from './schema';
import {
  Preferences,
  Currency,
  Subscription,
  ExchangeRates,
} from './types';

const db = new Database(schema, 'subra_');

export const preferences = db.table<Preferences>('preferences');
export const currencies = db.table<Currency>('currencies');
export const subscriptions = db.table<Subscription>('subscriptions');
export const exchangeRates = db.table<ExchangeRates>('exchangeRates');

const initialCurrencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar', isEnabled: true },
  { code: 'EUR', symbol: '€', name: 'Euro', isEnabled: true },
  { code: 'GBP', symbol: '£', name: 'British Pound', isEnabled: true },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', isEnabled: true },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', isEnabled: true },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', isEnabled: true },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', isEnabled: true },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', isEnabled: true },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', isEnabled: true },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', isEnabled: true },
];

if (currencies.query().length === 0) {
  initialCurrencies.forEach(currency => currencies.insert(currency));
}

const defaultExchangeRates = {
  timestamp: Date.now(),
  base: 'USD',
  rates: {
    EUR: 0.9629,
    GBP: 0.794,
    JPY: 150.5095,
    CAD: 1.4443,
    AUD: 1.609,
    CHF: 0.9023,
    CNY: 7.2899,
    INR: 87.4519,
    NZD: 1.7876,
  }
};

if (exchangeRates.query().length === 0) {
  exchangeRates.insert(defaultExchangeRates);
}

export * from './types';

export { db }; 