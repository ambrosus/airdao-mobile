import { ethers } from 'ethers';
import { DEX_SUPPORTED_TOKENS } from '../entities/tokens';
import { ERC20_ALLOWANCE_ABI } from '../lib/abi';
import { CheckAllowanceArgs } from '../types/swap.service';
import Config from '@constants/config';

const environment = Config.env === 'testnet' ? 'testnet' : 'production';

class Allowance {
  private provider = new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);
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

export const allowanceService = new Allowance();
