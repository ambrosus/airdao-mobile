import { CryptoCurrencyCode } from '@appTypes';
import { TokenDTO } from './dtos';

export class Token {
  address: string;
  name!: string;
  balance?: {
    wei?: string;
    ether?: number;
  };
  symbol!: CryptoCurrencyCode | string;

  private deriveNameAndSymbolFromDto(dto: TokenDTO, tokenUtils: any) {
    if (dto.name && dto.symbol) {
      this.name = dto.name;
      this.symbol = dto.symbol;
    } else {
      const tokenDetails = tokenUtils.getTokenDetails(dto.address);
      // @ts-ignore
      const { name, symbol } = tokenDetails;
      this.name = name;
      this.symbol = symbol;
    }
  }

  constructor(details: TokenDTO, tokenUtils: any) {
    this.address = details.address;
    this.balance = details.balance;
    this.deriveNameAndSymbolFromDto(details, tokenUtils);
  }
}
