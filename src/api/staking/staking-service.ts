import { BigNumber, ethers, utils } from 'ethers';
import Config from '@constants/config';
import { poolAbi, poolsAbi } from '@api/staking/abi';
import {
  PoolDetailsArgs,
  ReturnedPoolDetails,
  StakeArgs
} from '@api/staking/types';
import { Cache, CacheKey } from '@lib/cache';

const TEN = BigNumber.from(10);
const FIXED_POINT = TEN.pow(18);

const transactionGasLimit = 8000000;
const transactionGasPrice = utils.parseUnits('20', 'gwei');

class Staking {
  private provider = new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);

  createStakingPoolsContract(providerOrSigner = this.provider) {
    return new ethers.Contract(
      Config.POOL_STORE_CONTRACT_ADDRESS,
      poolsAbi,
      providerOrSigner
    );
  }

  async createStakingPoolContract(
    addressHash: string,
    providerOrSigner: ethers.providers.JsonRpcProvider | ethers.Wallet = this
      .provider
  ) {
    return new ethers.Contract(addressHash, poolAbi, providerOrSigner);
  }

  async createProvider(walletHash: string) {
    const privateKey = (await Cache.getItem(
      `${CacheKey.WalletPrivateKey}-${walletHash}`
    )) as string;

    return new ethers.Wallet(privateKey, this.provider);
  }

  async getStakingPoolsDetails({
    providerOrSigner = this.provider,
    address
  }: PoolDetailsArgs): Promise<ReturnedPoolDetails[] | undefined> {
    try {
      const contract = this.createStakingPoolsContract();
      const poolsCount = await contract?.getPoolsCount();
      const poolsAddresses = await contract?.getPools(0, poolsCount);

      return await Promise.all(
        poolsAddresses.map(async (addressHash: string) => {
          const poolContract = await this.createStakingPoolContract(
            addressHash,
            providerOrSigner
          );

          const [contractName, active, tokenPriceAMB, myStakeInTokens] =
            await Promise.all([
              poolContract.name(),
              poolContract.active(),
              poolContract.getTokenPrice(),
              poolContract.viewStake({
                from: address
              })
            ]);

          const myStakeInAMB = myStakeInTokens
            .mul(tokenPriceAMB)
            .div(FIXED_POINT);

          return {
            addressHash,
            contractName,
            active,
            user: {
              raw: myStakeInAMB,
              amb: ethers.utils.formatEther(myStakeInAMB)
            }
          };
        })
      );
    } catch (err) {
      console.error(err);
    }
  }

  async stake({ pool, value, walletHash }: StakeArgs) {
    const overrides = {
      value: utils.parseEther(value)
    };

    try {
      if (!pool) return;

      const signer = await this.createProvider(walletHash);
      const contract = await this.createStakingPoolContract(
        pool.addressHash,
        signer
      );

      const stakeContract = await contract.stake(overrides);
      return await stakeContract.wait();
    } catch (err) {
      console.error(err);
    }
  }
  async unstake({ pool, value, walletHash }: StakeArgs) {
    try {
      const signer = await this.createProvider(walletHash);
      const contract = await this.createStakingPoolContract(
        pool.addressHash,
        signer
      );

      const [tokenPriceAMB] = await Promise.all([contract.getTokenPrice()]);

      const bnUnstakeAmountAMB = utils.parseEther(value);
      const bnUnstakeAmountInTokens = bnUnstakeAmountAMB
        .mul(FIXED_POINT)
        .div(tokenPriceAMB);

      const overrides = {
        gasPrice: transactionGasPrice,
        gasLimit: transactionGasLimit
      };
      const unstakeContract = await contract.unstake(
        bnUnstakeAmountInTokens,
        overrides
      );
      return await unstakeContract.wait();
    } catch (err) {
      console.error(err);
    }
  }
}

export const staking = new Staking();
