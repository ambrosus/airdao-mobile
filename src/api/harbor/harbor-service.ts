import { ethers } from 'ethers';
import Config from '@constants/config';
import { HARBOR_ABI } from '@api/harbor/abi/harbor';

function calculateAPR(interestNumber: number, interestPeriodNumber: number) {
  const r = interestNumber / 1000000000;
  const periodsPerYear = ((365 * 24 * 60 * 60) / interestPeriodNumber) * r;

  return Math.ceil(periodsPerYear * 10000) / 100;
}

const provider = new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);

export const createHarborContract = ({
  providerOrSigner = provider,
  address = ''
}) => {
  return new ethers.Contract(address, HARBOR_ABI, providerOrSigner);
};

const getTotalStaked = async () => {
  try {
    const contract = createHarborContract({
      address: Config.ST_AMB_ADDRESS
    });
    const data = await contract.totalSupply();
    return data;
  } catch (e) {
    return e;
  }
};

const getStakeAPR = async () => {
  try {
    const contract = createHarborContract({
      address: Config.LIQUID_STAKING_ADDRESS
    });
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
      const contract = createHarborContract({
        address: Config.LIQUID_STAKING_ADDRESS
      });
      return await contract.getStake(address);
    }
    return null;
  } catch (e) {
    return e;
  }
};

export const harborService = {
  getTotalStaked,
  getStakeAPR,
  getCurrentUserStaked
};
