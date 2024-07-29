import { GetBalanceArgs } from '@appTypes';
import Config from '@constants/config';
import { ethers } from 'ethers';
import { ERC20_ABI } from './abi/ERC20_ABI';

class ERC20 {
  createNativeProvider() {
    return new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);
  }

  async balanceOf({ tokenAddress, ownerAddress }: GetBalanceArgs) {
    try {
      const provider = this.createNativeProvider();

      if (tokenAddress === ethers.constants.AddressZero)
        return await provider.getBalance(ownerAddress);

      const erc20 = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

      return await erc20.balanceOf(ownerAddress);
    } catch (error) {
      throw error;
    }
  }
}

export const erc20Contracts = new ERC20();
