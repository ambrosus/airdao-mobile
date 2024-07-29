import { ethers } from 'ethers';
import { GetAllowanceArgs, GetBalanceArgs, SetAllowanceArgs } from '@appTypes';
import Config from '@constants/config';
import { ERC20_ABI } from './abi/ERC20_ABI';

class ERC20 {
  /**
   * Creates an instance of ethers.providers.JsonRpcProvider using the network URL from the configuration.
   *
   * @returns {ethers.providers.JsonRpcProvider} The JSON-RPC provider.
   */
  createNativeProvider(): ethers.providers.JsonRpcProvider {
    return new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);
  }

  /**
   * Creates an instance of ethers.Wallet using the provided private key and the native provider.
   *
   * @param {string} privateKey - The private key to create the signer.
   * @returns {ethers.Wallet} The signer.
   */
  createSigner(privateKey: string): ethers.Wallet {
    return new ethers.Wallet(privateKey, this.createNativeProvider());
  }

  /**
   * Retrieves the balance of a given token or native currency for a specified owner address.
   *
   * @param {GetBalanceArgs} args - The arguments for retrieving the balance.
   * @param {string} args.tokenAddress - The address of the token contract or the native currency address.
   * @param {string} args.ownerAddress - The address of the owner whose balance is to be retrieved.
   * @returns {Promise<ethers.BigNumber>} The balance of the specified address.
   * @throws Will throw an error if unable to retrieve the balance.
   */
  async balanceOf({
    tokenAddress,
    ownerAddress
  }: GetBalanceArgs): Promise<ethers.BigNumber> {
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

  /**
   * Checks the allowance of a given token for a specified spender address.
   *
   * @param {GetAllowanceArgs} args - The arguments for checking the allowance.
   * @param {string} args.tokenAddress - The address of the token contract.
   * @param {string} args.privateKey - The private key to create the signer.
   * @param {string} args.amount - The amount to check the allowance against.
   * @param {string} args.spenderAddress - The address of the spender.
   * @returns {Promise<{ allowance: ethers.BigNumber, needToIncrease: boolean }>} The allowance and whether it needs to be increased.
   * @throws Will throw an error if unable to check the allowance.
   */
  async checkAllowance({
    tokenAddress,
    privateKey,
    amount,
    spenderAddress
  }: GetAllowanceArgs): Promise<{
    allowance: ethers.BigNumber;
    needToIncrease: boolean;
  }> {
    if (tokenAddress === ethers.constants.AddressZero)
      return {
        allowance: ethers.BigNumber.from('100000000000000'),
        needToIncrease: false
      };

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

  /**
   * Sets the allowance of a given token for a specified spender address.
   *
   * @param {SetAllowanceArgs} args - The arguments for setting the allowance.
   * @param {string} args.tokenAddress - The address of the token contract.
   * @param {string} args.privateKey - The private key to create the signer.
   * @param {string} args.amount - The amount to set as the allowance.
   * @param {string} args.spenderAddress - The address of the spender.
   * @returns {Promise<ethers.ContractTransaction>} The transaction response of the approve call.
   * @throws Will throw an error if unable to set the allowance.
   */
  async setAllowance({
    tokenAddress,
    privateKey,
    amount,
    spenderAddress
  }: SetAllowanceArgs): Promise<ethers.ContractTransaction> {
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
