import { BigNumber, ethers } from 'ethers';
import Config from '@constants/config';
import { poolAbi, poolsAbi } from '@api/staking/abi';
import { PoolDetailsArgs, ReturnedPoolDetails } from '@api/staking/types';

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

  async getStakingPoolsDetails({
    providerOrSigner = this.provider,
    address
  }: PoolDetailsArgs): Promise<ReturnedPoolDetails[] | undefined> {
    try {
      const contract = this.createStakingPoolsContract();
      const poolsCount = await contract?.getPoolsCount();
      const poolsAddresses = await contract?.getPools(1, poolsCount);

      return await Promise.all(
        poolsAddresses.map(async (addressHash: string) => {
          const poolContract = new ethers.Contract(
            addressHash,
            poolAbi,
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
              amb: ethers.utils.formatEther(myStakeInAMB)
            }
          };
        })
      );
    } catch (err) {
      console.error(err);
    }
  }
}

export const staking = new Staking();
