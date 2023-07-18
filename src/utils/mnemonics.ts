// eslint-disable-next-line @typescript-eslint/no-var-requires
const bip39 = require('bip39');
import { Crypto } from './crypto';

const generateNewMnemonic = async (size = 256) => {
  const random = await Crypto.getRandomBytes(size / 8);
  //@ts-ignore
  const mnemonic = bip39.entropyToMnemonic(Buffer.from(random, 'base64'));
  const hash = await Crypto.hashMnemonic(mnemonic);
  return { mnemonic, hash };
};

export const MnemonicUtils = { generateNewMnemonic };
