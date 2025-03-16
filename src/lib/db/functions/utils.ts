import { BillingCycle } from '../types';

export function validateBillingCycle(billingCycle: BillingCycle): boolean {
  const validFrequencies = ['weekly', 'monthly', 'quarterly', 'yearly'];
  
  if (!validFrequencies.includes(billingCycle.frequency)) {
    return false;
  }

  if (typeof billingCycle.startDate !== 'number' || isNaN(billingCycle.startDate)) {
    return false;
  }

  return true;
}

export function validateTimeFormat(time: string): boolean {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

export function validateCurrencyCode(code: string): boolean {
  const currencyCodeRegex = /^[A-Z]{3}$/;
  return currencyCodeRegex.test(code);
}

export function getStartOfDay(timestamp: number): number {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

export function getEndOfDay(timestamp: number): number {
  const date = new Date(timestamp);
  date.setHours(23, 59, 59, 999);
  return date.getTime();
}

export function addDays(timestamp: number, days: number): number {
  return timestamp + (days * 24 * 60 * 60 * 1000);
}

export function subtractDays(timestamp: number, days: number): number {
  return timestamp - (days * 24 * 60 * 60 * 1000);
}

export function isValidAmount(amount: number): boolean {
  return typeof amount === 'number' && 
         !isNaN(amount) && 
         isFinite(amount) && 
         amount >= 0;
}

export function roundToDecimalPlaces(number: number, places: number): number {
  const factor = Math.pow(10, places);
  return Math.round(number * factor) / factor;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
} 