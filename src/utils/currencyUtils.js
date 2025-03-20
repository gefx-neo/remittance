export const currencyDetails = {
  MYR: { symbol: "RM", normal: 4, reciprocal: 4 },
  IDR: { symbol: "Rp", normal: 8, reciprocal: 0 },
  USD: { symbol: "$", normal: 4, reciprocal: 4 },
  JPY: { symbol: "¥", normal: 6, reciprocal: 0 },
  YEN: { symbol: "¥", normal: 6, reciprocal: 0 },
  THB: { symbol: "฿", normal: 4, reciprocal: 4 },
  SGD: { symbol: "S$", normal: 4, reciprocal: 4 },
  CNY: { symbol: "¥", normal: 4, reciprocal: 4 },
  GBP: { symbol: "£", normal: 4, reciprocal: 4 },
};

const DEFAULT_NORMAL_SYMBOL = "S$"; // Default for normal rates

export function getCurrencySymbol(currency, isReciprocal = false) {
  if (!isReciprocal) {
    return DEFAULT_NORMAL_SYMBOL; // Always return "S$" for normal rates
  }
  return currencyDetails[currency]?.symbol ?? currency; // Use unique symbol for reciprocal rates
}

export function getCurrencyDecimals(currency) {
  return currencyDetails[currency]?.normal ?? 2; // Default to 2 decimals
}

export function getReciprocalDecimals(currency) {
  return currencyDetails[currency]?.reciprocal ?? 2; // Default to 2 decimals
}

export function formatCurrency(value, currency, isReciprocal = false) {
  const decimals = isReciprocal
    ? getReciprocalDecimals(currency)
    : getCurrencyDecimals(currency);

  return parseFloat(value).toFixed(decimals); // Return only the numeric value
}
