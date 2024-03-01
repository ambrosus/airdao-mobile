import AddressProcessor from '@lib/crypto/AddressProcessor';
import { CryptoUtils } from '@utils/crypto';

const getBalanceOfAddress = async (address: string) => {
  try {
    const weiBalance = await AddressProcessor.getBalance(address);
    const etherBalance = await CryptoUtils.toEther(weiBalance);
    return { wei: weiBalance, ether: etherBalance };
  } catch (error) {
    throw error;
  }
};

export const cryptoService = {
  getBalanceOfAddress
};
