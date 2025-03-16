import { preferences, Preferences } from '..';

export async function getPreferences(): Promise<Preferences | null> {
  const results = preferences.query({
    limit: 1
  });
  return results[0] || null;
}

export async function initializePreferences(): Promise<Preferences> {
  const existing = await getPreferences();
  if (existing) {
    return existing;
  }

  return preferences.insert({
    sortSubscriptionsBy: 'dueDate',
    defaultCurrency: 'USD',
    totalViewType: 'monthly',
    totalViewPeriod: 'upcoming',
  });
}

export async function updatePreferences(data: Partial<Preferences>): Promise<Preferences> {
  const existing = await getPreferences();
  if (!existing) {
    return initializePreferences();
  }

  return preferences.update(existing._id, data);
} 