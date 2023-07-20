// eslint-disable-next-line @typescript-eslint/no-var-requires
const bip39 = require('bip39');
import { DEFAULT_WORDS } from '@constants/words';
import { Crypto } from './crypto';

const generateNewMnemonic = async (size = 256) => {
  const random = await Crypto.getRandomBytes(size / 8);
  //@ts-ignore
  const mnemonic = bip39.entropyToMnemonic(Buffer.from(random, 'base64'));
  const hash = await Crypto.hashMnemonic(mnemonic);
  return { mnemonic, hash };
};

const recheckMnemonic = (mnemonic: string): string => {
  const words = mnemonic.trim().toLowerCase().split(/\s+/g);
  const checked = [];
  let word;
  for (word of words) {
    if (!word || word.length < 2) continue;
    const index = DEFAULT_WORDS.indexOf(word);
    if (index === -1) {
      throw new Error('BlocksoftKeysStorage invalid word ' + word);
    }
    checked.push(word);
  }
  if (checked.length <= 11) {
    throw new Error('BlocksoftKeysStorage invalid words length ' + mnemonic);
  }
  return checked.join(' ');
};

export const MnemonicUtils = { generateNewMnemonic, recheckMnemonic };
