import { ethers } from 'ethers';
import Config from '@constants/config';
import { ERC20_ALLOWANCE_ABI, ERC20_BALANCE } from '../lib/abi';
import type { BalanceArgs, CheckAllowanceArgs } from '../types/swap.service';
import { DEX_SUPPORTED_TOKENS } from '../entities/tokens';

const environment = Config.env === 'testnet' ? 'testnet' : 'production';

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

  async checkAllowance({ tokenFrom, walletAddress }: CheckAllowanceArgs) {
    try {
      if (
        tokenFrom &&
        tokenFrom !== DEX_SUPPORTED_TOKENS.default[environment].address
      ) {
        const contract = new ethers.Contract(
          tokenFrom,
          ERC20_ALLOWANCE_ABI,
          this.provider
        );

        const allowance = await contract.allowance(
          walletAddress,
          walletAddress
        );
        return allowance.toString();
      }
    } catch (error) {
      throw error;
    }
  }
}

export const DEXSwapInterfaceService = new DEXSwapService();
