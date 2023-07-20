import { Wallet } from '@models/Wallet';
import { Cache, CacheKey } from '@utils/cache';

export class AirDAOStorage {
  async isMnemonicAlreadySaved(newMnemonic: any) {
    return true;
  }
  async saveMnemonic(mnemonic: any): string {
    return;
  }
}

export default new AirDAOStorage();
