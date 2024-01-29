import * as ExpoCrypto from 'expo-crypto';
import Web3 from 'web3';

const hashMnemonic = async (mnemonic: string) => {
  return (
    await ExpoCrypto.digestStringAsync(
      ExpoCrypto.CryptoDigestAlgorithm.SHA256,
      mnemonic
    )
  ).substring(0, 32);
};

const getRandomBytes = async (size: number) => {
  return await ExpoCrypto.getRandomBytesAsync(size);
};

const toEther = async (wei: string) => {
  return Web3.utils.fromWei(wei);
};

export const CryptoUtils = { hashMnemonic, getRandomBytes, toEther };
