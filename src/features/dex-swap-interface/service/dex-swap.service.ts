import { ethers } from 'ethers';
import Config from '@constants/config';
import { ERC20_BALANCE } from '../lib/abi';
import type { BalanceArgs } from '../types/swap.service';

class DEXSwapService {
  private provider = new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);

  async balanceOf({ token, ownerAddress }: BalanceArgs) {
    try {
      if (token.symbol === 'AMB') {
        return await this.provider.getBalance(ownerAddress);
      } else if (token.address) {
        const contract = new ethers.Contract(
          token.address,
          ERC20_BALANCE,
          this.provider
        );

        return await contract.balanceOf(ownerAddress);
      }
    } catch (error) {
      throw error;
    }
  }

  async currentAllowance() {
    try {
      return null;
    } catch (error) {
      throw error;
    }
  }
}

export const DEXSwapInterfaceService = new DEXSwapService();
