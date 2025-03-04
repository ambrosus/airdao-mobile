import { BigNumber, ethers, utils } from 'ethers';
import { poolAbi, poolsAbi } from '@api/staking/abi';
import {
  PoolDetailsArgs,
  ReturnedPoolDetails,
  StakeArgs
} from '@api/staking/types';
import Config from '@constants/config';
import { Cache, CacheKey } from '@lib/cache';
import {
  CustomAppEvents,
  sendFirebaseEvent
} from '@lib/firebaseEventAnalytics';
import { estimatedNetworkProviderFee } from '@utils';

const STAKE_ESTIMATED_GAS_LIMIT = 67079;
// TODO: temporary unused constant
// const UNSTAKE_ESTIMATED_GAS_LIMIT = 77516;

const TEN = BigNumber.from(10);
const FIXED_POINT = TEN.pow(18);

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

          const [
            contractName,
            active,
            totalStakeInAMB,
            tokenPriceAMB,
            myStakeInTokens
          ] = await Promise.all([
            poolContract.name && poolContract.name(),
            poolContract.active && poolContract.active(),
            poolContract.totalStake && poolContract.totalStake(),
            poolContract.getTokenPrice && poolContract.getTokenPrice(),
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
            totalStakeInAMB: ethers.utils.formatEther(totalStakeInAMB),
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

  async estimateGas(gasLimit: number) {
    const gasPrice = await this.provider.getGasPrice();
    return gasPrice.mul(gasLimit);
  }

  async stake({ pool, value, walletHash }: StakeArgs) {
    const overrides = {
      value: utils.parseEther(value)
    };

    try {
      if (!pool) return;

      const signer = await this.createProvider(walletHash);
      sendFirebaseEvent(CustomAppEvents.stake_start);
      const contract = await this.createStakingPoolContract(
        pool.addressHash,
        signer
      );

      const estimatedGas = await this.estimateGas(STAKE_ESTIMATED_GAS_LIMIT);
      overrides.value = overrides.value.sub(estimatedGas);

      const stakeContract = await contract.stake(overrides);
      return await stakeContract.wait();
    } catch (err) {
      // @ts-ignore
      const errorMessage = err?.message ?? JSON.stringify(err);
      sendFirebaseEvent(CustomAppEvents.stake_error, {
        stakeError: errorMessage
      });
      console.error(err);
    }
  }

  async unstake({ pool, value, walletHash, estimateGas = false }: StakeArgs) {
    const overrides = {
      value: utils.parseEther(value)
    };

    try {
      const signer = await this.createProvider(walletHash);
      sendFirebaseEvent(CustomAppEvents.withdraw_start);
      const contract = await this.createStakingPoolContract(
        pool.addressHash,
        signer
      );

      const [tokenPriceAMB] = await Promise.all([contract.getTokenPrice()]);

      if (estimateGas) {
        const estimatedGas = await contract.estimateGas.unstake(value);

        return await estimatedNetworkProviderFee(estimatedGas);
      }

      const estimatedGas = await contract.estimateGas.unstake(value);
      const executedNetworkFee = await estimatedNetworkProviderFee(
        estimatedGas
      );

      overrides.value = overrides.value.sub(executedNetworkFee);

      const bnUnstakeAmountInTokens = overrides.value
        .mul(FIXED_POINT)
        .div(tokenPriceAMB);

      const unstakeContract = await contract.unstake(bnUnstakeAmountInTokens);

      return await unstakeContract.wait();
    } catch (err) {
      // @ts-ignore
      const errorMessage = err.message ?? JSON.stringify(err);
      sendFirebaseEvent(CustomAppEvents.withdraw_error, {
        withdrawError: errorMessage
      });

      console.error(err);
    }
  }
}

export const staking = new Staking();
