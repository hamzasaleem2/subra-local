import { Subscription, BillingCycle } from '../types';
import { convertAmount } from './currencies';
import { exchangeRates } from '../../db';

export interface SubscriptionInput {
  amount: number;
  currency: string;
  billingCycle: BillingCycle;
}

export interface PeriodTotal {
  period: string;
  amount: number;
  subscriptions: Array<{
    name: string;
    amount: number;
    dueDate: number;
  }>;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function addToDate(date: Date, amount: number, unit: 'days' | 'weeks' | 'months' | 'years'): Date {
  const newDate = new Date(date);
  switch (unit) {
    case 'days':
      newDate.setDate(date.getDate() + amount);
      break;
    case 'weeks':
      newDate.setDate(date.getDate() + (amount * 7));
      break;
    case 'months':
      newDate.setMonth(date.getMonth() + amount);
      break;
    case 'years':
      newDate.setFullYear(date.getFullYear() + amount);
      break;
  }
  return newDate;
}

export function getNextPaymentDate(startDate: number, frequency: string, currentDate: number = Date.now()): number {
  let nextPaymentDate = new Date(startDate);
  const currentDateTime = new Date(currentDate);
  
  while (nextPaymentDate <= currentDateTime) {
    switch (frequency) {
      case 'weekly':
        nextPaymentDate = addToDate(nextPaymentDate, 1, 'weeks');
        break;
      case 'monthly':
        nextPaymentDate = addToDate(nextPaymentDate, 1, 'months');
        break;
      case 'quarterly':
        nextPaymentDate = addToDate(nextPaymentDate, 3, 'months');
        break;
      case 'yearly':
        nextPaymentDate = addToDate(nextPaymentDate, 1, 'years');
        break;
    }
  }

  return nextPaymentDate.getTime();
}

function getPaymentDatesInRange(startDate: number, frequency: string, rangeStart: number, rangeEnd: number): number[] {
  const dates: number[] = [];
  let currentDate = new Date(getNextPaymentDate(startDate, frequency, rangeStart));
  const endDate = new Date(rangeEnd);

  while (currentDate <= endDate) {
    dates.push(currentDate.getTime());
    switch (frequency) {
      case 'weekly':
        currentDate = addToDate(currentDate, 1, 'weeks');
        break;
      case 'monthly':
        currentDate = addToDate(currentDate, 1, 'months');
        break;
      case 'quarterly':
        currentDate = addToDate(currentDate, 3, 'months');
        break;
      case 'yearly':
        currentDate = addToDate(currentDate, 1, 'years');
        break;
    }
  }

  return dates;
}

export function formatTimeUntil(timestamp: number): string {
  const now = new Date();
  const targetDate = new Date(timestamp);
  
  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);

  let monthsDiff = (targetDate.getFullYear() - now.getFullYear()) * 12 + 
                  (targetDate.getMonth() - now.getMonth());
  
  const targetDay = targetDate.getDate();
  const nowDay = now.getDate();
  
  if (targetDay < nowDay && monthsDiff > 0) {
    monthsDiff--;
  }
  
  if (targetDay > nowDay && monthsDiff < 0) {
    monthsDiff++;
  }

  if (diffDays < 0) {
    const absDays = Math.abs(diffDays);
    const absWeeks = Math.abs(diffWeeks);
    const absMonths = Math.abs(monthsDiff);

    if (absDays < 7) return `${absDays} days ago`;
    if (absWeeks < 4) return `${absWeeks} weeks ago`;
    if (absMonths === 0) return `${absWeeks} weeks ago`; // Fallback to weeks if less than a month
    return `${absMonths} months ago`;
  }

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 7) return `In ${diffDays} days`;
  if (diffWeeks === 1) return 'Next week';
  if (diffWeeks < 4) return `In ${diffWeeks} weeks`;
  if (monthsDiff === 0) return `In ${diffWeeks} weeks`; // Fallback to weeks if less than a month
  if (monthsDiff === 1) return 'Next month';
  return `In ${monthsDiff} months`;
}

export function convertToUSD(amount: number, fromCurrency: string): number {
  if (fromCurrency === 'USD') return amount;

  const rates = exchangeRates.query()[0];
  if (!rates) return amount; // Fallback to original amount if no rates found

  const rate = rates.rates[fromCurrency];
  if (!rate) return amount; // Fallback to original amount if rate not found

  return amount / rate;
}

export function convertFromUSD(amount: number, toCurrency: string): number {
  if (toCurrency === 'USD') return amount;

  const rates = exchangeRates.query()[0];
  if (!rates) return amount; // Fallback to original amount if no rates found

  const rate = rates.rates[toCurrency];
  if (!rate) return amount; // Fallback to original amount if rate not found

  return amount * rate;
}

export async function calculateMonthlyTotal(subscriptions: Subscription[], targetCurrency: string): Promise<number> {
  return subscriptions.reduce((total, sub) => {
    let amount = sub.amount;
    
    switch (sub.billingCycle.frequency) {
      case 'weekly':
        amount *= 52/12; // 52 weeks per year / 12 months
        break;
      case 'yearly':
        amount /= 12;
        break;
      case 'quarterly':
        amount /= 3;
        break;
    }

    const amountInUSD = convertToUSD(amount, sub.currency);
    
    return total + convertFromUSD(amountInUSD, targetCurrency);
  }, 0);
}

export async function calculateYearlyTotal(subscriptions: Subscription[], targetCurrency: string): Promise<number> {
  return subscriptions.reduce((total, sub) => {
    let amount = sub.amount;
    
    switch (sub.billingCycle.frequency) {
      case 'weekly':
        amount *= 52;
        break;
      case 'monthly':
        amount *= 12;
        break;
      case 'quarterly':
        amount *= 4;
        break;
    }

    const amountInUSD = convertToUSD(amount, sub.currency);
    
    return total + convertFromUSD(amountInUSD, targetCurrency);
  }, 0);
}

export async function calculateWeeklyTotal(subscriptions: Subscription[], targetCurrency: string): Promise<number> {
  return subscriptions.reduce((total, sub) => {
    let amount = sub.amount;
    
    switch (sub.billingCycle.frequency) {
      case 'monthly':
        amount *= 12/52; // 12 months per year / 52 weeks
        break;
      case 'yearly':
        amount /= 52;
        break;
      case 'quarterly':
        amount *= 4/52; // 4 quarters per year / 52 weeks
        break;
    }

    const amountInUSD = convertToUSD(amount, sub.currency);
    
    return total + convertFromUSD(amountInUSD, targetCurrency);
  }, 0);
}

export async function calculateRemainingPayments(subscription: Subscription, endDate: Date): Promise<number> {
  let count = 0;
  const currentDate = new Date(getNextPaymentDate(
    subscription.billingCycle.startDate,
    subscription.billingCycle.frequency
  ));

  while (currentDate <= endDate) {
    count++;
    switch (subscription.billingCycle.frequency) {
      case "weekly":
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case "monthly":
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
      case "quarterly":
        currentDate.setMonth(currentDate.getMonth() + 3);
        break;
      case "yearly":
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        break;
    }
  }

  return count;
}

export async function calculateUpcomingPayments(
  subscriptions: Subscription[],
  targetCurrency: string,
  startDate: number = Date.now(),
  months: number = 3
): Promise<PeriodTotal[]> {
  const endDate = startDate + (months * 30 * MS_PER_DAY);
  const periodTotals: Map<string, PeriodTotal> = new Map();

  for (const sub of subscriptions) {
    let amount = sub.amount;
    
    if (sub.currency !== targetCurrency) {
      const converted = await convertAmount(amount, sub.currency, targetCurrency);
      if (converted === null) continue;
      amount = converted;
    }

    const paymentDates = getPaymentDatesInRange(
      sub.billingCycle.startDate,
      sub.billingCycle.frequency,
      startDate,
      endDate
    );

    for (const date of paymentDates) {
      const periodKey = new Date(date).toISOString().slice(0, 7); // YYYY-MM format
      const periodTotal = periodTotals.get(periodKey) || {
        period: periodKey,
        amount: 0,
        subscriptions: []
      };

      periodTotal.amount += amount;
      periodTotal.subscriptions.push({
        name: sub.name,
        amount,
        dueDate: date
      });

      periodTotals.set(periodKey, periodTotal);
    }
  }

  return Array.from(periodTotals.values()).sort((a, b) => a.period.localeCompare(b.period));
}

export function getNextPayment(subscription: Subscription): number {
  return getNextPaymentDate(
    subscription.billingCycle.startDate,
    subscription.billingCycle.frequency
  );
} 