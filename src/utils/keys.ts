/* eslint-disable @typescript-eslint/no-var-requires */
import * as Crypto from 'expo-crypto';
import { DEFAULT_WORDS } from '@constants/words';
// @ts-ignore
import createHmac from 'create-hmac';
const bip39 = require('bip39');

interface CreateHmacPDFK2Sizes {
  [key: string]: number;
}

const createHmacPDFK2Sizes: CreateHmacPDFK2Sizes = {
  md5: 16,
  sha1: 20,
  sha224: 28,
  sha256: 32,
  sha384: 48,
  sha512: 64,
  rmd160: 20,
  ripemd160: 20
};

class KeysUtills {
  static _pbkdf2(
    password: string,
    salt: Buffer,
    iterations: number,
    keylen: number,
    digest?: string
  ): Buffer {
    digest = digest || 'sha1';

    const DK = Buffer.allocUnsafe(keylen);
    const block1 = Buffer.allocUnsafe(salt.length + 4);
    salt.copy(block1, 0, 0, salt.length);

    let destPos = 0;
    const hLen = createHmacPDFK2Sizes[digest];
    const l = Math.ceil(keylen / hLen);

    for (let i = 1; i <= l; i++) {
      block1.writeUInt32BE(i, salt.length);

      const T = createHmac(digest, password).update(block1).digest();
      let U = T;

      for (let j = 1; j < iterations; j++) {
        U = createHmac(digest, password).update(U).digest();
        for (let k = 0; k < hLen; k++) {
          T[k] = T[k] + U[k];
        }
      }

      T.copy(DK, destPos);
      destPos += hLen;
    }

    return DK;
  }

  static recheckMnemonic(mnemonic: string): string {
    const words = mnemonic.trim().toLowerCase().split(/\s+/g);
    const checked = [];
    let word;

    for (word of words) {
      if (!word || word.length < 2) {
        continue;
      }

      const index = DEFAULT_WORDS.indexOf(word);

      if (index === -1) {
        throw new Error('AirDAOKeysStorage invalid word ' + word);
      }

      checked.push(word);
    }

    if (checked.length <= 11) {
      throw new Error('AirDAOKeysStorage invalid words length ' + mnemonic);
    }

    return checked.join(' ');
  }

  static async hashMnemonic(mnemonic: string): Promise<string> {
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      mnemonic
    ).then((hash: string) => hash.substr(0, 32));
  }

  static async bip39MnemonicToSeed(
    mnemonic: string,
    password?: string
  ): Promise<Buffer> {
    if (!mnemonic) {
      throw new Error('bip39MnemonicToSeed is empty');
    }

    // tslint:disable-next-line:no-shadowed-variable
    function salt(password: string): string {
      return 'mnemonic' + (password || '');
    }

    const saltBuffer = Buffer.from(salt(password || ''), 'utf8');
    const mnemonicBuffer = Buffer.from(mnemonic || '', 'utf8');
    try {
      const tmp2 = await bip39.mnemonicToSeedSync(mnemonic);
      return Buffer.from(tmp2);
    } catch (e) {
      // @ts-ignore
      return this._pbkdf2(mnemonicBuffer, saltBuffer, 2048, 64, 'sha512');
    }
  }
}

export default KeysUtills;
