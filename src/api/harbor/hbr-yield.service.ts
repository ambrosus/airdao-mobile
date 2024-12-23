import { ethers } from 'ethers';
import { provider } from '@api/nft-contract-service';
import Config from '@constants/config';
import { HBR_POOL } from './abi';

const createHBRLiquidityPoolContract = (providerOrSigner = provider) => {
  return new ethers.Contract(
    Config.HBR_LIQUIDITY_POOL,
    HBR_POOL,
    providerOrSigner
  );
};

class HBRYieldService {
  private contract = createHBRLiquidityPoolContract();

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
}

export const hbrYieldService = new HBRYieldService();
