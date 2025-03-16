import { useState, useEffect } from 'react';
import { preferences } from '../db';
import type { Preferences } from '../db/types';

const defaultPreferences = {
  defaultCurrency: 'USD',
  sortSubscriptionsBy: 'name',
  totalViewType: 'average',
  totalViewPeriod: 'monthly',
} as const;

export function usePreferences() {
  const [userPreferences, setUserPreferences] = useState<Preferences | null>(null);

  useEffect(() => {
    const loadPreferences = () => {
      const results = preferences.query();
      if (results.length === 0) {
        const newPreferences = preferences.insert(defaultPreferences);
        setUserPreferences(newPreferences);
      } else {
        setUserPreferences(results[0]);
      }
    };

    loadPreferences();
  }, []);

  const updatePreferences = (newPreferences: Partial<Preferences>) => {
    if (!userPreferences) return;

    const updated = preferences.update(userPreferences._id, newPreferences);
    setUserPreferences(updated);
  };

  return {
    preferences: userPreferences ?? defaultPreferences,
    updatePreferences,
  };
} 