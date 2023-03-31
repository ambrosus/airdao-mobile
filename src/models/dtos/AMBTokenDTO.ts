export interface AMBTokenDTO {
  '_id': string;
  'id': number;
  'name': string;
  'symbol': string;
  'circulating_supply': number;
  'max_supply': null | number;
  'total_supply': number;
  'timestamp': string;
  'rank': number;
  'percent_change_1h': number;
  'percent_change_24h': number;
  'percent_change_7d': number;
  'price_usd': number;
  '24_volume_usd': number;
  'market_cap_usd': number;
  'createdAt': number;
}
