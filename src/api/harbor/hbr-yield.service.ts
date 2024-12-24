import { Wallet, ethers } from 'ethers';
import { provider } from '@api/nft-contract-service';
import Config from '@constants/config';
import { IsNullableAccount } from '@entities/wallet/model/types';
import { AmbErrorProvider } from '@lib';
import { ERC20_ABI } from '@lib/erc20/abi/ERC20_ABI';
import { HBR_POOL } from './abi';

const createHBRLiquidityPoolContract = (
  providerOrSigner: Wallet | ethers.providers.JsonRpcProvider = provider
) => {
  return new ethers.Contract(
    Config.HBR_LIQUIDITY_POOL,
    HBR_POOL,
    providerOrSigner
  );
};

const createHBRTokenContract = (providerOrSigner = provider) => {
  return new ethers.Contract(
    Config.HBR_TOKEN_ADDRESS,
    ERC20_ABI,
    providerOrSigner
  );
};

const createSigner = (privateKey: string) => {
  const provider = new AmbErrorProvider(Config.NETWORK_URL, Config.CHAIN_ID);
  return new ethers.Wallet(privateKey, provider);
};

class HBRYieldService {
  private contract = createHBRLiquidityPoolContract();
  private tokenContract = createHBRTokenContract();

  async staked(address: string) {
    return await this.contract.getStake(address);
  }

  async rewards(address: string) {
    return await this.contract.getUserRewards(address);
  }

  async deposit(address: string) {
    return await this.contract.getDeposit(address);
  }

  async limitConfig() {
    return await this.contract.limitsConfig();
  }

  async liquidityPool() {
    return await this.contract.info();
  }

  async maxUserStakeLimit(address: string) {
    return await this.contract.getMaxUserStakeValue(address);
  }

  async allowance(address: string) {
    return await this.tokenContract.allowance(
      address,
      Config.HBR_LIQUIDITY_POOL
    );
  }

  async _deposit(
    amount: string,
    wallet: IsNullableAccount | undefined,
    privateKey: string
  ) {
    if (!wallet) throw Error('No wallet found!');

    const bnAmount = ethers.utils.parseEther(amount);
    const signer = createSigner(privateKey);
    const contract = createHBRLiquidityPoolContract(signer);

    const tx = await contract.deposit(bnAmount);
    return await tx.wait();
  }
}

export const hbrYieldService = new HBRYieldService();
