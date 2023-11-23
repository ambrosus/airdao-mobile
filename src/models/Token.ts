import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';
import { TokenDTO } from './dtos';

export class Token {
  address: string;
  name!: string;
  balance: {
    wei: string;
    ether: number;
  };
  symbol!: AirDAODictTypes.Code;

  private deriveNameAndSymbolFromDto(dto: TokenDTO) {
    let name = '';
    let symbol = AirDAODictTypes.Code.AMB;
    if (dto.name) name = dto.name;
    if (dto.symbol) symbol = dto.symbol;
    switch (dto.address) {
      case '0x322269e52800e5094c008f3b01A3FD97BB3C8f5D': {
        // hera
        name = 'Hera Pool Token';
        symbol = AirDAODictTypes.Code.HeraPoolToken;
        break;
      }
      case '0xE984ACe36F2B6f10Fec8dd6fc1bB19c7b1D2F2c6': {
        // ganymede
        name = 'Ganymede Pool Token';
        symbol = AirDAODictTypes.Code.GanymedePoolToken;
        break;
      }
      case '0xEB8386a50Edd613cc43f061E9C5A915b0443C5d4': {
        // hera
        name = 'Plutus Pool Token';
        symbol = AirDAODictTypes.Code.PlutusPoolToken;
        break;
      }
      default:
        break;
    }
    this.name = name;
    this.symbol = symbol;
  }

  constructor(details: TokenDTO) {
    this.address = details.address;
    this.balance = details.balance;
    this.deriveNameAndSymbolFromDto(details);
  }
}
