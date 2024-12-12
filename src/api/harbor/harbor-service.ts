import { BigNumber, ethers } from 'ethers';
import { RawRecord } from '@nozbe/watermelondb';
import Config from '@constants/config';
import { HARBOR_ABI } from '@api/harbor/abi/harbor';
import { Cache, CacheKey } from '@lib/cache';
import { parseEther } from 'ethers/lib/utils';

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
    return await contract.totalSupply();
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

const getUserStaked = async (address: string) => {
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

const getUnStakeLockTime = async () => {
  try {
    const contract = createHarborLiquidStakedContract();
    const data = await contract.unstakeLockTime();

    return {
      rate: '1 AMB = 1 stAMB',
      delay: (Number(data) / 86400).toFixed(0) || '0'
    };
  } catch (e) {
    return e;
  }
};

const getTier = async (address: string) => {
  try {
    const contract = new ethers.Contract(
      Config.STAKING_TIERS_ADDRESS,
      HARBOR_ABI,
      provider
    );
    const data = await contract.calculateTier(address);
    const value = Number(data);
    if (isNaN(value)) {
      return 1;
    }
    switch (true) {
      case value >= 100:
        return 4;
      case value >= 75:
        return 3;
      case value >= 50:
        return 2;
      case value >= 25:
        return 1;
      default:
        return 1;
    }
  } catch (e) {
    return 1;
  }
};

const getClaimAmount = async (address: string) => {
  try {
    const contract = createHarborLiquidStakedContract();
    return await contract.getClaimAmount(address);
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

const processWithdraw = async (
  wallet: RawRecord | undefined,
  amount: string,
  _desiredCoeff: number
) => {
  try {
    const privateKey = (await Cache.getItem(
      // @ts-ignore
      `${CacheKey.WalletPrivateKey}-${wallet.hash}`
    )) as string;
    const signer = createSigner(privateKey);
    // @ts-ignore
    const contract = createHarborLiquidStakedContract(signer);
    const desiredCoeff = _desiredCoeff * 100;
    const tx = await contract.unstake(parseEther(amount), desiredCoeff);
    if (tx) {
      const res = await tx.wait();
      if (res) {
        return res;
      }
    }
  } catch (e) {
    return e;
  }
};
const processClaimReward = async (
  wallet: RawRecord | undefined,
  amount: string,
  _desiredCoeff: number
) => {
  try {
    const privateKey = (await Cache.getItem(
      // @ts-ignore
      `${CacheKey.WalletPrivateKey}-${wallet.hash}`
    )) as string;
    const signer = createSigner(privateKey);
    // @ts-ignore
    const contract = createHarborLiquidStakedContract(signer);
    const desiredCoeff = _desiredCoeff * 100;
    return await contract.claimRewards(desiredCoeff);
    // if (tx) {
    //   const res = await tx.wait();
    //   if (res) {
    //     return res;
    //   }
    // }
  } catch (e) {
    return e;
  }
};

export const harborService = {
  getTotalStaked,
  getStakeAPR,
  getUserStaked,
  getStakeLimit,
  getUnStakeLockTime,
  getTier,
  getClaimAmount,
  processStake,
  processWithdraw,
  processClaimReward
};
