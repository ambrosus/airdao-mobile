/* eslint-disable @typescript-eslint/no-var-requires */

import { KeysUtils } from '@utils/keys';
const bip32 = require('bip32');

interface CacheRoots {
  [key: string]: any;
}
const ETH_CACHE: CacheRoots = {};
const CACHE: CacheRoots = {};
const CACHE_ROOTS: CacheRoots = {};
class AirDAOKeys {
  async getSeedCached(mnemonic: string) {
    const mnemonicCache = mnemonic.toLowerCase();
    if (typeof CACHE[mnemonicCache] === 'undefined') {
      CACHE[mnemonicCache] = await KeysUtils.bip39MnemonicToSeed(
        mnemonic.toLowerCase()
      );
    }
    const seed = CACHE[mnemonicCache]; // will be rechecked on saving
    return seed;
  }

  async getBip32Cached(mnemonic: string, network = false, seed = false) {
    const mnemonicCache = mnemonic.toLowerCase() + '_' + (network || 'btc');
    if (typeof CACHE_ROOTS[mnemonicCache] === 'undefined') {
      if (!seed) {
        seed = await this.getSeedCached(mnemonic);
      }
      const root = network
        ? bip32.fromSeed(seed, network)
        : bip32.fromSeed(seed);
      CACHE_ROOTS[mnemonicCache] = root;
    }
    return CACHE_ROOTS[mnemonicCache];
  }

  getEthCached(mnemonicCache: string) {
    if (typeof ETH_CACHE[mnemonicCache] === 'undefined') return false;
    return ETH_CACHE[mnemonicCache];
  }

  setEthCached(
    mnemonic: string,
    result: {
      address: string;
      privateKey: string;
      path: string;
      index: number;
      type: unknown;
    }
  ) {
    const mnemonicCache = mnemonic.toLowerCase();
    ETH_CACHE[mnemonicCache] = result;
  }
}
const singleAirDaoKeys = new AirDAOKeys();
export default singleAirDaoKeys;
