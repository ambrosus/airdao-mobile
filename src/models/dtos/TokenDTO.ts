import { CryptoCurrencyCode } from '@appTypes';

export interface TokenDTO {
  address: string;
  name: string;
  isNativeCoin: boolean;
  balance: {
    wei: string;
    ether: number;
  };
  symbol: CryptoCurrencyCode | '';
}
