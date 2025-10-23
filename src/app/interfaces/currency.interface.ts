export interface Currency {
  symbol: string;
  name: string;
  symbol_native: string;
  decimal_digits: number;
  rounding: number;
  code: string;
  name_plural: string;
}

export interface ExchangeRate {
  from: string;
  to: string;
  amount: number;
  result: number;
  date: string;
}

export interface ConversionHistory {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  result: number;
  date: string;
  historicalDate?: string;
}