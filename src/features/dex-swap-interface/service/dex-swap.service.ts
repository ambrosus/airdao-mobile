import { ethers } from 'ethers';
import Config from '@constants/config';
import { ERC20_BALANCE, ERC20_TRADE } from '../lib/abi';
import type { BalanceArgs } from '../types/swap.service';
import { isNativeWrapped, wrapNativeAddress } from '../utils/native-wrapped';

interface GetAmountsOutArgs {
  path: [string, string];
  amountToSell: string;
}

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

  async getAmountsOut({ path, amountToSell }: GetAmountsOutArgs) {
    try {
      if (amountToSell === '' || amountToSell === '0') return;

      const bnAmountToSell = ethers.utils.parseUnits(amountToSell);
      const excludeNativeETH = wrapNativeAddress(path);

      const isSelectedSameTokens = isNativeWrapped(excludeNativeETH);

      if (isSelectedSameTokens) {
        return bnAmountToSell;
      }

      const contract = new ethers.Contract(
        Config.DEX_ROUTER_V2_ADDRESS,
        ERC20_TRADE,
        this.provider
      );

      const [, amountToReceive] = await contract.getAmountsOut(
        bnAmountToSell,
        excludeNativeETH
      );

      return amountToReceive;
    } catch (error) {
      console.error(error);
    }
  }
}

export const DEXSwapInterfaceService = new DEXSwapService();
