import { currencies, exchangeRates, Currency, ExchangeRates } from '..';

export async function getEnabledCurrencies(): Promise<Currency[]> {
  return currencies.query({
    conditions: [{ field: 'isEnabled', operator: 'eq', value: true }],
    sort: [{ field: 'code', order: 'asc' }]
  });
}

export async function getCurrencyByCode(code: string): Promise<Currency | null> {
  const results = currencies.query({
    conditions: [{ field: 'code', operator: 'eq', value: code }]
  });
  return results[0] || null;
}

export async function updateCurrency(code: string, data: Partial<Currency>): Promise<Currency> {
  const currency = await getCurrencyByCode(code);
  if (!currency) {
    throw new Error(`Currency ${code} not found`);
  }
  return currencies.update(currency._id, data);
}

export async function getLatestExchangeRates(): Promise<ExchangeRates | null> {
  const results = exchangeRates.query({
    sort: [{ field: 'timestamp', order: 'desc' }],
    limit: 1
  });
  return results[0] || null;
}

export async function updateExchangeRates(rates: Record<string, number>, base: string = 'USD'): Promise<ExchangeRates> {
  const now = Date.now();
  return exchangeRates.insert({
    timestamp: now,
    rates,
    base
  });
}

export async function convertAmount(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number | null> {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const rates = await getLatestExchangeRates();
  if (!rates) {
    return null;
  }

  if (rates.base === toCurrency) {
    const fromRate = rates.rates[fromCurrency];
    if (!fromRate) return null;
    return amount / fromRate;
  }

  if (rates.base === fromCurrency) {
    const toRate = rates.rates[toCurrency];
    if (!toRate) return null;
    return amount * toRate;
  }

  const fromRate = rates.rates[fromCurrency];
  const toRate = rates.rates[toCurrency];
  if (!fromRate || !toRate) return null;

  const amountInBase = amount / fromRate;
  return amountInBase * toRate;
} 