import { ethers } from 'ethers';
import Config from '@constants/config';
import { TokenInfo } from '@utils/token';

interface BalanceArgs {
  token: TokenInfo;
  ownerAddress: string;
}

class DEXSwapService {
  private provider = new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);

  async balanceOf({ token, ownerAddress }: BalanceArgs) {
    try {
      if (token.symbol === 'AMB') {
        return await this.provider.getBalance(ownerAddress);
      } else if (token.address) {
        const minABI = [
          {
            constant: true,
            inputs: [{ name: '_owner', type: 'address' }],
            name: 'balanceOf',
            outputs: [{ name: 'balance', type: 'uint256' }],
            type: 'function'
          }
        ];

        const contract = new ethers.Contract(
          token.address,
          minABI,
          this.provider
        );

        return await contract.balanceOf(ownerAddress);
      }
    } catch (error) {
      throw error;
    }
  }
}

export const DEXSwapInterfaceService = new DEXSwapService();
