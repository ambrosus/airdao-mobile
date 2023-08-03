/**
 * @version 0.41
 */
import { Web3Injected } from '@crypto/services/Web3Injected';

/**
 * @param address
 * @returns {boolean}
 */
export const isEnsAddressValid = (address: string) => {
  if (address) {
    try {
      return /^.+\.eth$/.test(address);
    } catch (e: any) {
      console.log(e);
    }
  }
  return false;
};

export const getEnsAddress = async (address: any) => {
  const WEB3 = Web3Injected('mainnet');
  const res = await WEB3.eth.ens.getAddress(address);
  return res;
};
