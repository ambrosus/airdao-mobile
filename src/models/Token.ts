import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';
import { TokenDTO } from './dtos';
import { TokenUtils } from '@utils/token';

export class Token {
  address: string;
  name!: string;
  balance: {
    wei: string;
    ether: number;
  };
  symbol!: AirDAODictTypes.Code;

  private deriveNameAndSymbolFromDto(dto: TokenDTO) {
    const tokenDetails = TokenUtils.getTokenDetails(dto.address);
    this.name = dto.name || tokenDetails.name;
    this.symbol = dto.symbol || tokenDetails.symbol;
  }

  constructor(details: TokenDTO) {
    this.address = details.address;
    this.balance = details.balance;
    this.deriveNameAndSymbolFromDto(details);
  }
}
