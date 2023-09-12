export interface CurrencyHistory {
  source: string;
  destination: string;
  amount: number;
  result: number;
  wasFixedRate: boolean;
  rate: number;
}
