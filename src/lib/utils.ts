import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(date: number | Date, formatStr: string = "MMM d, yyyy") {
  return format(date, formatStr);
}

export function formatShortDate(date: number | Date) {
  return format(date, "yyyy-MM-dd");
}

export function formatTimeUntil(date: number): string {
  const now = Date.now();
  const targetDate = new Date(date);
  const currentDate = new Date(now);

  const diffInMs = targetDate.getTime() - now;
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays < 0) return "Overdue";
  if (diffInDays === 0) return "Due today";
  if (diffInDays === 1) return "Due tomorrow";
  if (diffInDays < 7) return `Due in ${diffInDays} days`;
  
  if (diffInDays < 30) {
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `Due in ${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'}`;
  }
  
  let months = (targetDate.getFullYear() - currentDate.getFullYear()) * 12 + 
               (targetDate.getMonth() - currentDate.getMonth());
  
  if (targetDate.getDate() < currentDate.getDate()) {
    months -= 1;
  }
  
  if (months > 0) {
    return `Due in ${months} ${months === 1 ? 'month' : 'months'}`;
  }
  
  return `Due in ${diffInDays} days`;
}

export function getNextPaymentClass(daysUntil: number): string {
  if (daysUntil < 0) return "text-destructive";  // Overdue - red
  if (daysUntil <= 7) return "text-warning";     // Due within a week - yellow/orange
  return "text-muted-foreground";                // Future payments - muted
}

export function normalizeCategory(category: string): string {
  return category.trim().toLowerCase();
}
