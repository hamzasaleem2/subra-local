import { useCallback, useEffect, useState } from 'react';
import { db } from '../db';
import type { Subscription } from '../db/types';
import type { Database, Document } from '../storage';
import { getNextPayment } from '../db/functions/calculators';

export interface SubscriptionWithId extends Subscription {
  _id: string;
  nextPayment: {
    dueDate: number;
    isLastPayment: boolean;
  };
}

type SubscriptionDocument = Document & Subscription;

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithId[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const subs = await (db as Database).table('subscriptions').getAll() as SubscriptionDocument[];
      
      const subsWithNextPayment = subs.map(sub => {
        const nextPaymentDate = getNextPayment(sub);
        
        let isLastPayment = false;
        if (sub.billingCycle.duration) {
          const startDate = new Date(sub.billingCycle.startDate);
          const durationInMs = sub.billingCycle.duration * 30 * 24 * 60 * 60 * 1000; // Approximate month in ms
          const endDate = new Date(startDate.getTime() + durationInMs);
          
          const nextDate = new Date(nextPaymentDate);
          switch (sub.billingCycle.frequency) {
            case 'weekly':
              isLastPayment = nextDate.getTime() + (7 * 24 * 60 * 60 * 1000) > endDate.getTime();
              break;
            case 'monthly':
              isLastPayment = nextDate.getTime() + (30 * 24 * 60 * 60 * 1000) > endDate.getTime();
              break;
            case 'quarterly':
              isLastPayment = nextDate.getTime() + (90 * 24 * 60 * 60 * 1000) > endDate.getTime();
              break;
            case 'yearly':
              isLastPayment = nextDate.getTime() + (365 * 24 * 60 * 60 * 1000) > endDate.getTime();
              break;
          }
        }

        const nextPayment = {
          dueDate: nextPaymentDate,
          isLastPayment
        };

        return {
          ...sub,
          _id: (sub.id || sub._id) as string,
          nextPayment
        };
      });

      setSubscriptions(subsWithNextPayment);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to fetch subscriptions'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();

    const unsubscribe = (db as Database).table('subscriptions').subscribe(() => {
      fetchSubscriptions();
    });

    return () => {
      unsubscribe();
    };
  }, [fetchSubscriptions]);

  const addSubscription = useCallback(async (subscription: Omit<Subscription, 'id'>) => {
    try {
      const newSub = await (db as Database).table('subscriptions').insert(subscription) as SubscriptionDocument;
      return newSub;
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to add subscription'));
      throw e;
    }
  }, []);

  const updateSubscription = useCallback(async (id: string, subscription: Partial<Subscription>) => {
    try {
      const updatedSub = await (db as Database).table('subscriptions').update(id, subscription) as SubscriptionDocument;
      return updatedSub;
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to update subscription'));
      throw e;
    }
  }, []);

  const deleteSubscription = useCallback(async (id: string) => {
    try {
      await (db as Database).table('subscriptions').delete(id);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to delete subscription'));
      throw e;
    }
  }, []);

  return {
    subscriptions,
    isLoading,
    error,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    refresh: fetchSubscriptions
  };
} 