import { AMBTokenDTO } from './dtos';

export class AMBToken {
  _id: string;
  id: number;
  name: string;
  symbol: string;
  circulatingSupply: number;
  maxSupply: number | null;
  totalSupply: number;
  timestamp: Date;
  rank: number;
  percentChange1H: number;
  percentChange24H: number;
  percentChange7D: number;
  priceUSD: number;
  volumeUSD: number;
  marketCapUSD: number;
  createdAt: Date;

  constructor(details: AMBTokenDTO) {
    this._id = details._id;
    this.id = details.id;
    this.name = details.name;
    this.symbol = details.symbol;
    this.circulatingSupply = details.circulating_supply;
    this.maxSupply = details.max_supply;
    this.totalSupply = details.total_supply;
    this.timestamp = new Date(details.timestamp);
    this.rank = details.rank;
    this.percentChange1H = details.percent_change_1h;
    this.percentChange24H = details.percent_change_24h;
    this.percentChange7D = details.percent_change_7d;
    this.priceUSD = details.price_usd;
    this.volumeUSD = details['24_volume_usd'];
    this.marketCapUSD = details.market_cap_usd;
    this.createdAt = new Date(details.createdAt);
  }
}
