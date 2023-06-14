// export interface CMCChartQuote {
//   timestamp: string;
//   quote: {
//     USD: {
//       price: number;
//       volume_24h: number;
//       market_cap: number;
//       circulating_supply: number;
//       total_supply: number;
//       timestamp: string;
//     };
//   };
// }
export type CMCChartQuote = [number, number];

// export interface CMCChartData {
//   [key: string]: {
//     id: number;
//     symbol: string;
//     is_active: number;
//     is_fiat: unknown;
//     quotes: CMCChartQuote[];
//   };
// }

export type CMCChartData = [number, number][];
export type CMCInterval =
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | '5m'
  | '10m'
  | '15m'
  | '30m'
  | '45m'
  | '1h'
  | '2h'
  | '3h'
  | '4h'
  | '6h'
  | '12h'
  | '1d'
  | '2d'
  | '3d'
  | '7d'
  | '14d'
  | '15d'
  | '30d'
  | '60d'
  | '90d'
  | '365d';
