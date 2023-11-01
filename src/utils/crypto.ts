import * as ExpoCrypto from 'expo-crypto';

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

export const Crypto = { hashMnemonic, getRandomBytes };
