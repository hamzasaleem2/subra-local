import { subscriptions, Subscription } from '..';

export async function getSubscription(id: string): Promise<Subscription | null> {
  return subscriptions.getById(id);
}

export async function getAllSubscriptions(): Promise<Subscription[]> {
  return subscriptions.query({
    sort: [{ field: '_createdAt', order: 'desc' }]
  });
}

export async function createSubscription(data: Omit<Subscription, '_id' | '_createdAt' | '_updatedAt'>): Promise<Subscription> {
  return subscriptions.insert(data);
}

export async function updateSubscription(id: string, data: Partial<Subscription>): Promise<Subscription> {
  return subscriptions.update(id, data);
}

export async function deleteSubscription(id: string): Promise<void> {
  return subscriptions.delete(id);
}

export async function getSubscriptionsByBrand(brandId: string): Promise<Subscription[]> {
  return subscriptions.query({
    conditions: [{ field: 'brandId', operator: 'eq', value: brandId }]
  });
}

export async function getUpcomingPayments(startDate: number, endDate: number): Promise<Subscription[]> {
  const allSubs = await getAllSubscriptions();
  
  return allSubs.filter(sub => {
    const cycle = sub.billingCycle;
    let nextPayment = cycle.startDate;

    while (nextPayment < startDate) {
      switch (cycle.frequency) {
        case 'weekly':
          nextPayment += 7 * 24 * 60 * 60 * 1000;
          break;
        case 'monthly':
          nextPayment += 30 * 24 * 60 * 60 * 1000;
          break;
        case 'quarterly':
          nextPayment += 90 * 24 * 60 * 60 * 1000;
          break;
        case 'yearly':
          nextPayment += 365 * 24 * 60 * 60 * 1000;
          break;
      }
    }

    return nextPayment >= startDate && nextPayment <= endDate;
  });
}

export async function calculateTotalSpending(
  currency: string,
  startDate?: number,
  endDate?: number
): Promise<number> {
  const allSubs = await getAllSubscriptions();
  
  return allSubs.reduce((total, sub) => {
    if (sub.currency !== currency) {
      return total;
    }

    if (!startDate || !endDate) {
      return total + sub.amount;
    }

    const cycle = sub.billingCycle;
    let nextPayment = cycle.startDate;
    let payments = 0;

    while (nextPayment <= endDate) {
      if (nextPayment >= startDate) {
        payments++;
      }

      switch (cycle.frequency) {
        case 'weekly':
          nextPayment += 7 * 24 * 60 * 60 * 1000;
          break;
        case 'monthly':
          nextPayment += 30 * 24 * 60 * 60 * 1000;
          break;
        case 'quarterly':
          nextPayment += 90 * 24 * 60 * 60 * 1000;
          break;
        case 'yearly':
          nextPayment += 365 * 24 * 60 * 60 * 1000;
          break;
      }
    }

    return total + (sub.amount * payments);
  }, 0);
} 