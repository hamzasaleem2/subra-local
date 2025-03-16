import { useState, useEffect } from 'react';
import { currencies } from '../db';
import type { Currency } from '../db/types';

export function useCurrencies() {
  const [availableCurrencies, setAvailableCurrencies] = useState<Currency[]>([]);

  useEffect(() => {
    const loadCurrencies = () => {
      const results = currencies.query({
        conditions: [{ field: 'isEnabled', operator: 'eq', value: true }],
        sort: [{ field: 'code', order: 'asc' }]
      });
      setAvailableCurrencies(results);
    };

    loadCurrencies();
  }, []);

  return {
    currencies: availableCurrencies,
  };
} 