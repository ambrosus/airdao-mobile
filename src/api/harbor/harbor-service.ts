import { BigNumber, ethers } from 'ethers';
import { RawRecord } from '@nozbe/watermelondb';
import Config from '@constants/config';
import { HARBOR_ABI } from '@api/harbor/abi/harbor';
import { Cache, CacheKey } from '@lib/cache';

function calculateAPR(interestNumber: number, interestPeriodNumber: number) {
  const r = interestNumber / 1000000000;
  const periodsPerYear = ((365 * 24 * 60 * 60) / interestPeriodNumber) * r;

  return Math.ceil(periodsPerYear * 10000) / 100;
}

const provider = new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);
const createSigner = (privateKey: string) => {
  return new ethers.Wallet(privateKey, provider);
};

export const createHarborLiquidStakedContract = (
  providerOrSigner = provider
) => {
  return new ethers.Contract(
    Config.LIQUID_STAKING_ADDRESS,
    HARBOR_ABI,
    providerOrSigner
  );
};

const getTotalStaked = async () => {
  try {
    const contract = new ethers.Contract(
      Config.ST_AMB_ADDRESS,
      HARBOR_ABI,
      provider
    );
    const data = await contract.totalSupply();
    return data;
  } catch (e) {
    return e;
  }
};

const getStakeAPR = async () => {
  try {
    const contract = createHarborLiquidStakedContract();
    const interest = await contract.interest();
    const interestPeriod = await contract.interestPeriod();
    return calculateAPR(Number(interest), Number(interestPeriod));
  } catch (e) {
    return e;
  }
};

const getCurrentUserStaked = async (address: string) => {
  try {
    if (address) {
      const contract = createHarborLiquidStakedContract();
      return await contract.getStake(address);
    }
    return null;
  } catch (e) {
    return e;
  }
};

const getStakeLimit = async () => {
  try {
    const contract = createHarborLiquidStakedContract();
    return await contract.minStakeValue();
  } catch (e) {
    return e;
  }
};

const processStake = async (
  wallet: RawRecord | undefined,
  value: BigNumber
) => {
  try {
    if (wallet) {
      const privateKey = (await Cache.getItem(
        // @ts-ignore
        `${CacheKey.WalletPrivateKey}-${wallet.hash}`
      )) as string;
      const signer = createSigner(privateKey);
      // @ts-ignore
      const contract = createHarborLiquidStakedContract(signer);
      const tx = await contract.stake({ value });
      if (tx) {
        const res = await tx.wait();
        if (res) {
          return res;
        }
      }
    }
  } catch (e) {
    return e;
  }
};

export const harborService = {
  getTotalStaked,
  getStakeAPR,
  getCurrentUserStaked,
  getStakeLimit,
  processStake
};
