import { ethers } from 'ethers';
import { GetAllowanceArgs, GetBalanceArgs, SetAllowanceArgs } from '@appTypes';
import Config from '@constants/config';
import { ERC20_ABI } from './abi/ERC20_ABI';

class ERC20 {
  createNativeProvider() {
    return new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);
  }

  createSigner(privateKey: string) {
    return new ethers.Wallet(privateKey, this.createNativeProvider());
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

  async checkAllowance({
    tokenAddress,
    privateKey,
    amount,
    spenderAddress
  }: GetAllowanceArgs) {
    if (tokenAddress === ethers.constants.AddressZero) return false;
    try {
      const bnAmount = ethers.utils.parseEther(amount);

      const signer = this.createSigner(privateKey);
      const erc20 = new ethers.Contract(
        ethers.constants.AddressZero,
        ERC20_ABI
      );
      const signedERC2OContract = erc20.attach(tokenAddress).connect(signer);

      const allowance = await signedERC2OContract.allowance(
        signer.getAddress(),
        spenderAddress
      );

      const isAllowanceLessThanAmount = allowance.lt(bnAmount);

      return { allowance, needToIncrease: isAllowanceLessThanAmount };
    } catch (error) {
      throw error;
    }
  }

  async setAllowance({
    tokenAddress,
    privateKey,
    amount,
    spenderAddress
  }: SetAllowanceArgs) {
    try {
      const bnAmount = ethers.utils.parseEther(amount);
      const signer = this.createSigner(privateKey);
      const erc20 = new ethers.Contract(
        ethers.constants.AddressZero,
        ERC20_ABI
      );
      const signedERC2OContract = erc20.attach(tokenAddress).connect(signer);
      return await signedERC2OContract.approve(spenderAddress, bnAmount);
    } catch (error) {
      throw error;
    }
  }
}

export const erc20Contracts = new ERC20();
