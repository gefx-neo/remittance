import { useEnvironment } from "@/composables/useEnvironment";

export const currencyDetails = {
  MYR: { symbol: "RM", normal: 4, reciprocal: 4 },
  IDR: { symbol: "Rp", normal: 4, reciprocal: 4 },
  USD: { symbol: "$", normal: 4, reciprocal: 4 },
  JPY: { symbol: "¥", normal: 4, reciprocal: 4 },
  YEN: { symbol: "¥", normal: 4, reciprocal: 4 },
  THB: { symbol: "฿", normal: 4, reciprocal: 4 },
  SGD: { symbol: "S$", normal: 4, reciprocal: 4 },
  CNY: { symbol: "¥", normal: 4, reciprocal: 4 },
  CNH: { symbol: "¥", normal: 4, reciprocal: 4 },
  GBP: { symbol: "£", normal: 4, reciprocal: 4 },
  EUR: { symbol: "€", normal: 4, reciprocal: 4 },
  AUD: { symbol: "A$", normal: 4, reciprocal: 4 },
  INR: { symbol: "₹", normal: 4, reciprocal: 4 },
  PHP: { symbol: "₱", normal: 4, reciprocal: 4 },
  VND: { symbol: "₫", normal: 4, reciprocal: 4 },
};

export const CURRENCY_LIST = ["SGD", "USD", "EUR", "AUD", "MYR", "IDR", "VND"];

export function getAllowedCurrencies(base) {
  return CURRENCY_LIST.filter((currency) => currency !== base);
}

const DEFAULT_NORMAL_SYMBOL = "S$"; // Default for normal rates

export function getCurrencySymbol(currency, isReciprocal = false) {
  if (!isReciprocal) {
    return DEFAULT_NORMAL_SYMBOL; // Always return "S$" for normal rates
  }
  return currencyDetails[currency]?.symbol ?? currency; // Use unique symbol for reciprocal rates
}

export function getCurrencyDecimals(currency) {
  return currencyDetails[currency]?.normal ?? 4; // Default to 4 decimals
}

export function getReciprocalDecimals(currency) {
  return currencyDetails[currency]?.reciprocal ?? 4; // Default to 4 decimals
}

export function formatCurrency(value, currency, isReciprocal = false) {
  const decimals = isReciprocal
    ? getReciprocalDecimals(currency)
    : getCurrencyDecimals(currency);

  return Number.parseFloat(value).toFixed(decimals); // Return only the numeric value
}

export const getCurrencyImagePath = (currencyCode, usePng = false) => {
  const { imagePath } = useEnvironment();
  const extension = usePng ? "png" : "svg";

  return currencyCode
    ? `${imagePath}/currency/${currencyCode.toLowerCase()}.${extension}`
    : `${imagePath}/currency/default.${extension}`;
};
