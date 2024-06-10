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
  async checkAllowance({
    addressFrom,
    privateKey,
    amountAllowance
  }: CheckAllowanceArgs) {
    try {
      if (addressFrom !== DEX_SUPPORTED_TOKENS.default[environment].address) {
        const signer = new ethers.Wallet(privateKey, this.provider);

        const erc20Contract = new ethers.Contract(
          ethers.constants.AddressZero,
          ERC20_ALLOWANCE_ABI
        );

        const erc20 = erc20Contract.attach(addressFrom).connect(signer);

        const allowance = await erc20.allowance(
          await signer.getAddress(),
          Config.DEX_ROUTER_V2_ADDRESS
        );

        const bnAmountAllowance = ethers.utils.parseUnits(
          String(amountAllowance),
          18
        );

        return allowance.lt(bnAmountAllowance);
      }
    } catch (error) {
      console.error(error);
    }
  }
  async setAllowance({
    privateKey,
    addressFrom,
    amountAllowance
  }: CheckAllowanceArgs) {
    try {
      if (addressFrom !== DEX_SUPPORTED_TOKENS.default[environment].address) {
        const signer = new ethers.Wallet(privateKey, this.provider);

        const erc20Contract = new ethers.Contract(
          ethers.constants.AddressZero,
          ERC20_ALLOWANCE_ABI
        );

        const erc20 = erc20Contract.attach(addressFrom).connect(signer);

        const bnApproveAllowance = ethers.utils.parseUnits(
          String(amountAllowance),
          18
        );

        return erc20.approve(Config.DEX_ROUTER_V2_ADDRESS, bnApproveAllowance);
      }
    } catch (error) {
      throw error;
    }
  }
}

export const DEXSwapInterfaceService = new DEXSwapService();
