import { CryptoCurrencyCode } from '@appTypes';
import { TokenDTO } from './dtos';
import { formatUnits } from 'ethers/lib/utils';
import { AMB_DECIMALS } from '@constants/variables';
import { getTokenNameFromDatabase } from '@utils/getTokenNameFromDatabase';

export class Token {
  address: string;
  name!: string;
  isNativeCoin?: string | boolean;
  balance: {
    formattedBalance: string;
    wei: string;
    ether: number;
  };
  tokenNameFromDatabase: string;
  decimals: number;
  symbol!: CryptoCurrencyCode | string;

  private async deriveNameAndSymbolFromDto(dto: TokenDTO, tokenUtils: any) {
    if (dto.name && dto.symbol) {
      this.name = dto.name;
      this.balance = {
        ...dto.balance,
        formattedBalance: formatUnits(dto?.balance?.wei || 0, dto.decimals)
      };
      this.tokenNameFromDatabase =
        dto?.tokenNameFromDatabase ?? getTokenNameFromDatabase(dto.address);
      this.symbol = dto.symbol;
      this.decimals = dto.decimals;
    } else {
      const tokenDetails = await tokenUtils.getTokenDetails(dto.address);
      // @ts-ignore
      const { name, symbol } = tokenDetails;

      this.name = name;
      this.balance = {
        ...dto?.balance,
        formattedBalance: formatUnits(
          dto?.balance?.wei || 0,
          dto?.decimals || AMB_DECIMALS
        )
      };
      this.tokenNameFromDatabase =
        dto?.tokenNameFromDatabase ?? getTokenNameFromDatabase(dto.address);
      this.symbol = symbol;
    }
  }

  constructor(details: TokenDTO, tokenUtils: any) {
    this.isNativeCoin = details.isNativeCoin || '';
    this.address = details.address;
    this.balance = details.balance;
    this.tokenNameFromDatabase = details.tokenNameFromDatabase;
    this.decimals = details.decimals;
    this.deriveNameAndSymbolFromDto(details, tokenUtils);
  }
}
