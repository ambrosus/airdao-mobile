import * as SecureStore from 'expo-secure-store';
import KeysUtills from '@utils/keys';
import config from '@constants/config';
import AirDAODict from '@crypto/common/AirDAODict';
import { bip32 } from 'bitcoinjs-lib';
import BlocksoftDispatcher from '@lib/BlocksoftDispatcher';
const networksConstants = require('../lib/common/ext/network-constants');
const bip39 = require('bip39');
const bip32 = require('bip32');
const bs58check = require('bs58check');

const appCacheConfig = {
  lifeTime: 3600
};

type Network = {
  wif: number;
  bip32: {
    public: number;
    private: number;
  };
  messagePrefix: string;
  bech32?: string;
  pubKeyHash: number;
  scriptHash: number;
  coin: string;
};

const ETH_CACHE = {};
const CACHE = {};

class AirDAOKeys {
  private _bipHex: any;
  private async getRandomBytes(size: number): Promise<string> {
    // TODO implement the function to generate random bytes
    return '';
  }

  private async _tonCheckRevert(mnemonic: string): Promise<boolean> {
    // TODO implement the function to check TON mnemonic
    return false;
  }

  public async newMnemonic(size = 256): Promise<string> {
    let mnemonic: string;
    try {
      const random = await this.getRandomBytes(size / 8);
      mnemonic = bip39.entropyToMnemonic(Buffer.from(random, 'base64'));
      if (await this._tonCheckRevert(mnemonic)) {
        throw new Error('TON Mnemonic is not validating');
      }
    } catch (e: any) {
      throw new Error(`AirDAOKeys newMnemonic error ${e.message}`);
    }
    return mnemonic;
  }

  async validateMnemonic(mnemonic: string): Promise<boolean> {
    const result = bip39.validateMnemonic(mnemonic);
    if (!result) {
      throw new Error('invalid mnemonic for bip39');
    }
    return result;
  }

  async getSeedCached(mnemonic: string): Promise<Buffer> {
    const mnemonicCache = mnemonic.toLowerCase();
    let seed: Buffer;
    try {
      seed = await SecureStore.getItemAsync(mnemonicCache);
      if (!seed) {
        throw new Error();
      }
    } catch {
      seed = await KeysUtills.bip39MnemonicToSeed(mnemonic.toLowerCase());
      await SecureStore.setItemAsync(mnemonicCache, seed.toString());
    }
    return seed;
  }

  async setEthCached(mnemonic: string, result: any): Promise<void> {
    const mnemonicCache = mnemonic.toLowerCase();
    await SecureStore.setItemAsync(mnemonicCache, JSON.stringify(result));
  }

  async getEthCached(mnemonic: string): Promise<any> {
    const mnemonicCache = mnemonic.toLowerCase();
    const result = await SecureStore.getItemAsync(mnemonicCache);
    if (!result) {
      return false;
    }
    return JSON.parse(result);
  }

  async getBip32Cached(
    mnemonic: string,
    network?: Network,
    seed?: Buffer
  ): Promise<bip32.BIP32Interface> {
    const mnemonicCache = mnemonic.toLowerCase();
    let root: bip32.BIP32Interface | null = null;
    const cachedRoot = await SecureStore.getItemAsync(mnemonicCache);
    if (cachedRoot) {
      root = bip32.fromBase58(cachedRoot);
    } else {
      if (!seed) {
        seed = await this.getSeedCached(mnemonic);
      }
      root = network ? bip32.fromSeed(seed, network) : bip32.fromSeed(seed);
      await SecureStore.setItemAsync(mnemonicCache, root.toBase58());
    }
    return root;
  }

  async discoverAddresses(data: any, source: string) {
    const logData = { ...data };
    if (typeof logData.mnemonic !== 'undefined') logData.mnemonic = '***';
    let toDiscover = AirDAODict.Codes;
    if (data.currencyCode) {
      if (typeof data.currencyCode === 'string') {
        toDiscover = [data.currencyCode];
      } else {
        toDiscover = data.currencyCode;
      }
    }
    const fromIndex = data.fromIndex ? data.fromIndex : 0;
    const toIndex = data.toIndex ? data.toIndex : 10;
    const fullTree = data.fullTree ? data.fullTree : false;
    const results = {};
    const mnemonicCache = data.mnemonic.toLowerCase();
    let bitcoinRoot = false;
    let currencyCode;
    let settings;
    const seed = await KeysUtills.bip39MnemonicToSeed(
      data.mnemonic.toLowerCase()
    );
    for (currencyCode of toDiscover) {
      results[currencyCode] = [];
      try {
        settings = AirDAODict.getCurrencyAllSettings(
          currencyCode,
          'BlocksoftKeys'
        );
      } catch (e) {
        // do nothing for now
        continue;
      }

      let hexes = [];
      if (settings.addressCurrencyCode) {
        hexes.push(this._bipHex[settings.addressCurrencyCode]);
        if (!this._bipHex[settings.addressCurrencyCode]) {
          throw new Error(
            'UNKNOWN_CURRENCY_CODE SETTED ' + settings.addressCurrencyCode
          );
        }
      }

      if (this._bipHex[currencyCode]) {
        hexes.push(this._bipHex[currencyCode]);
      } else if (!settings.addressCurrencyCode) {
        if (
          settings.extendsProcessor &&
          this._bipHex[settings.extendsProcessor]
        ) {
          hexes.push(this._bipHex[settings.extendsProcessor]);
        } else {
          throw new Error(
            'UNKNOWN_CURRENCY_CODE ' +
              currencyCode +
              ' in bipHex AND NO SETTED addressCurrencyCode'
          );
        }
      }

      let isAlreadyMain = false;

      if (!data.fullTree) {
        hexes = [hexes[0]];
      }

      const hexesCache =
        mnemonicCache +
        '_' +
        settings.addressProcessor +
        '_fromINDEX_' +
        fromIndex +
        '_' +
        JSON.stringify(hexes);
      let hasDerivations = false;
      if (
        typeof data.derivations !== 'undefined' &&
        typeof data.derivations[currencyCode] !== 'undefined' &&
        data.derivations[currencyCode]
      ) {
        hasDerivations = true;
      }
      if (typeof CACHE[hexesCache] === 'undefined' || hasDerivations) {
        // AirDAOCryptoLog.log(`BlocksoftKeys will discover ${settings.addressProcessor}`)
        let root = false;
        if (typeof networksConstants[currencyCode] !== 'undefined') {
          root = await this.getBip32Cached(
            data.mnemonic,
            networksConstants[currencyCode],
            seed
          );
        } else {
          if (!bitcoinRoot) {
            bitcoinRoot = await this.getBip32Cached(data.mnemonic);
          }
          root = bitcoinRoot;
        }
        // BIP32 Extended Private Key to check - uncomment
        // let childFirst = root.derivePath('m/44\'/2\'/0\'/0')
        // AirDAOCryptoLog.log(childFirst.toBase58())

        /**
         * @type {EthAddressProcessor|BtcAddressProcessor}
         */
        const processor = await BlocksoftDispatcher.innerGetAddressProcessor(
          settings
        );

        try {
          await processor.setBasicRoot(root);
        } catch (e) {
          e.message += ' while doing ' + JSON.stringify(settings);
          throw e;
        }
        let currentFromIndex = fromIndex;
        let currentToIndex = toIndex;
        let currentFullTree = fullTree;
        if (hasDerivations) {
          let derivation = { path: '', alreadyShown: 0, walletPubId: 0 };
          let maxIndex = 0;
          for (derivation of data.derivations[currencyCode]) {
            const child = root.derivePath(derivation.path);
            const tmp = derivation.path.split('/');
            const result = await processor.getAddress(
              child.privateKey,
              {
                publicKey: child.publicKey,
                walletHash: data.walletHash,
                derivationPath: derivation.path
              },
              data,
              seed,
              'discoverAddresses'
            );
            result.basicPrivateKey = child.privateKey.toString('hex');
            result.basicPublicKey = child.publicKey.toString('hex');
            result.path = derivation.path;
            result.alreadyShown = derivation.alreadyShown;
            result.walletPubId = derivation.walletPubId || 0;
            result.index = tmp[5];
            if (maxIndex < result.index) {
              maxIndex = result.index * 1;
            }
            result.type = 'main';
            results[currencyCode].push(result);
          }
          if (maxIndex > 0) {
            // noinspection PointlessArithmeticExpressionJS
            currentFromIndex = maxIndex * 1 + 1;
            currentToIndex = currentFromIndex * 1 + 10;
            currentFullTree = true;
          }
        }

        let suffixes;
        if (currencyCode === 'SOL') {
          suffixes = [
            { type: 'main', suffix: false, after: `'/0'` },
            { type: 'no_scan', suffix: false, after: `'` }
          ];
        } else if (currentFullTree) {
          suffixes = [
            { type: 'main', suffix: `0'/0` },
            { type: 'change', suffix: `0'/1` }
            // { 'type': 'second', 'suffix': `1'/0` },
            // { 'type': 'secondchange', 'suffix': `1'/1` }
          ];
        } else {
          suffixes = [{ type: 'main', suffix: `0'/0` }];
          if (currencyCode === 'BTC_SEGWIT_COMPATIBLE') {
            suffixes = [
              { type: 'main', suffix: '0/1' } // heh
            ];
          }
          hexes = [hexes[0]];
        }

        let hex;
        for (hex of hexes) {
          if (isAlreadyMain) {
            suffixes[0].type = 'second';
          }
          isAlreadyMain = true;

          if (currentFromIndex >= 0 && currentToIndex >= 0) {
            for (
              let index = currentFromIndex;
              index < currentToIndex;
              index++
            ) {
              let suffix;
              for (suffix of suffixes) {
                const path = suffix.suffix
                  ? `m/${hex}'/${suffix.suffix}/${index}`
                  : `m/${hex}'/${index}${suffix.after}`;
                let privateKey = false;
                let publicKey = false;
                if (
                  currencyCode === 'SOL' ||
                  currencyCode === 'XLM' ||
                  currencyCode === 'WAVES' ||
                  currencyCode === 'ASH'
                ) {
                  // @todo move to coin address processor
                } else {
                  const child = root.derivePath(path);
                  privateKey = child.privateKey;
                  publicKey = child.publicKey;
                }
                const result = await processor.getAddress(
                  privateKey,
                  {
                    publicKey,
                    walletHash: data.walletHash,
                    derivationPath: path,
                    derivationIndex: index,
                    derivationType: suffix.type
                  },
                  data,
                  seed,
                  'discoverAddresses2'
                );
                if (result) {
                  if (privateKey) {
                    result.basicPrivateKey = privateKey.toString('hex');
                    result.basicPublicKey = publicKey.toString('hex');
                  }
                  result.path = path;
                  result.index = index;
                  result.alreadyShown = 0;
                  result.type = suffix.type;
                  results[currencyCode].push(result);
                }
              }
            }
          }
        }
        CACHE[hexesCache] = results[currencyCode];
        if (currencyCode === 'ETH') {
          ETH_CACHE[mnemonicCache] = results[currencyCode][0];
        }
      } else {
        results[currencyCode] = CACHE[hexesCache];
        if (currencyCode === 'USDT') {
          results[currencyCode] = [results[currencyCode][0]];
        }
      }
    }
    return results;
  }

  // TODO discoverOne

  async discoverOne(data) {
    const seed = await KeysUtills.bip39MnemonicToSeed(
      data.mnemonic.toLowerCase()
    );
    const root = bip32.fromSeed(seed);
    const child = root.derivePath(data.derivationPath.replace(/quote/g, "'"));
    /**
     * @type {EthAddressProcessor|BtcAddressProcessor}
     */
    // const processor = await BlocksoftDispatcher.getAddressProcessor(
    //   data.currencyCode
    // );
    // processor.setBasicRoot(root);
    // return processor.getAddress(
    //   child.privateKey,
    //   {
    //     derivationPath: data.derivationPath,
    //     derivationIndex: data.derivationIndex,
    //     derivationType: data.derivationType,
    //     publicKey: child.publicKey
    //   },
    //   data,
    //   seed,
    //   'discoverOne'
    // );
  }

  async discoverXpub(data: {
    mnemonic: string;
    currencyCode: string;
  }): Promise<string> {
    try {
      const seed = await KeysUtills.bip39MnemonicToSeed(
        data.mnemonic.toLowerCase()
      );
      const root = bip32.fromSeed(seed);
      let path = `m/44'/0'/0'`;
      let version = 0x0488b21e;
      if (data.currencyCode === 'BTC_SEGWIT_COMPATIBLE') {
        path = `m/49'/0'/0'`;
        version = 0x049d7cb2;
      }
      const rootWallet = root.derivePath(path);
      const res = bs58check.encode(
        this.serialize(rootWallet, version, rootWallet.publicKey)
      );
      return res;
    } catch (error) {
      throw error;
    }
  }

  serialize(hdkey: any, version: number, key: Buffer, LEN = 78): Buffer {
    try {
      const buffer = Buffer.allocUnsafe(LEN);
      buffer.writeUInt32BE(version, 0);
      buffer.writeUInt8(hdkey.depth, 4);

      const fingerprint = hdkey.depth ? hdkey.parentFingerprint : 0x00000000;
      buffer.writeUInt32BE(fingerprint, 5);
      buffer.writeUInt32BE(hdkey.index, 9);
      buffer.copy(hdkey.chainCode, 0, 13);
      key.copy(buffer, 45);

      return buffer;
    } catch (error) {
      throw error;
    }
  }

  async setSecureKeyValue(key: string, value: string): Promise<void> {
    let text = '';
    try {
      text = await KeysUtills.hashMnemonic(value);
      await SecureStore.setItemAsync(key, text);
    } catch (e: any) {
      throw new Error(`AirDAOKeys setSecureKeyValue error ${e.message}`);
    }
  }

  async getSecureKeyValue(key: string): Promise<string | null> {
    let text: string | null = '';
    try {
      text = await SecureStore.getItemAsync(key);
      if (text) {
        const result = KeysUtills.hashMnemonic(text);
        return result;
      } else {
        return null;
      }
    } catch (e: any) {
      throw new Error(`AirDAOKeys getSecureKeyValue error ${e.message}`);
    }
  }

  async removeSecureKeyValue(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (e: any) {
      throw new Error(`AirDAOKeys removeSecureKeyValue error ${e.message}`);
    }
  }

  async setMnemonic(value: string, walletHash: string): Promise<void> {
    const key = `mnemonic_${walletHash}`;
    await this.setSecureKeyValue(key, value);
  }

  async getMnemonic(currencyCode: string): Promise<string | null> {
    const key = `mnemonic_${currencyCode}`;
    return await this.getSecureKeyValue(key);
  }

  async removeMnemonic(currencyCode: string): Promise<void> {
    const key = `mnemonic_${currencyCode}`;
    await this.removeSecureKeyValue(key);
  }

  async setWallet(
    walletHash: string,
    walletPubId: number,
    currencyCode: string,
    walletData: any
  ): Promise<void> {
    const key = `wallet_${walletHash}_${walletPubId}_${currencyCode}`;
    await this.setSecureKeyValue(key, JSON.stringify(walletData));
  }

  async getWallet(
    walletHash: string,
    walletPubId: number,
    currencyCode: string
  ): Promise<any | null> {
    const key = `wallet_${walletHash}_${walletPubId}_${currencyCode}`;
    const value = await this.getSecureKeyValue(key);
    if (value) {
      return JSON.parse(value);
    } else {
      return null;
    }
  }

  async removeWallet(
    walletHash: string,
    walletPubId: number,
    currencyCode: string
  ): Promise<void> {
    const key = `wallet_${walletHash}_${walletPubId}_${currencyCode}`;
    await this.removeSecureKeyValue(key);
  }

  async setSelectedWallet(
    walletHash: string,
    walletPubId: number,
    currencyCode: string
  ): Promise<void> {
    const key = `selected_wallet_${currencyCode}`;
    await this.setSecureKeyValue(key, `${walletHash}_${walletPubId}`);
  }

  async getSelectedWallet(
    currencyCode: string
  ): Promise<{ walletHash: string; walletPubId: number } | null> {
    const key = `selected_wallet_${currencyCode}`;
    const value = await this.getSecureKeyValue(key);
    if (value) {
      const values = value.split('_');
      return {
        walletHash: values[0],
        walletPubId: parseInt(values[1], 10)
      };
    } else {
      return null;
    }
  }

  async removeSelectedWallet(currencyCode: string): Promise<void> {
    const key = `selected_wallet_${currencyCode}`;
    await this.removeSecureKeyValue(key);
  }

  async setCache(key: string, value: any): Promise<void> {
    const cacheSettings = appCacheConfig;
    if (cacheSettings && cacheSettings.lifeTime && cacheSettings.lifeTime > 0) {
      const cacheKey = `cache_${key}`;
      await this.setSecureKeyValue(
        cacheKey,
        JSON.stringify({ value, timestamp: new Date().getTime() })
      );
    }
  }

  async getCache(key: string): Promise<any | null> {
    const cacheSettings = appCacheConfig;
    if (cacheSettings && cacheSettings.lifeTime && cacheSettings.lifeTime > 0) {
      const cacheKey = `cache_${key}`;
      const value = await this.getSecureKeyValue(cacheKey);
      if (value) {
        const { value: cachedValue, timestamp } = JSON.parse(value);
        const currentTime = new Date().getTime();
        if (currentTime - timestamp < cacheSettings.lifeTime * 1000) {
          return cachedValue;
        } else {
          await this.removeSecureKeyValue(cacheKey);
          return null;
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  async removeCache(key: string): Promise<void> {
    const cacheSettings = appCacheConfig;
    if (cacheSettings && cacheSettings.lifeTime && cacheSettings.lifeTime > 0) {
      const cacheKey = `cache_${key}`;
      await this.removeSecureKeyValue(cacheKey);
    }
  }

  async setAppVersion(version: string): Promise<void> {
    const key = 'app_version';
    await this.setSecureKeyValue(key, version);
  }

  async getAppVersion(): Promise<string | null> {
    const key = 'app_version';
    return await this.getSecureKeyValue(key);
  }

  async setLog(logData: any): Promise<void> {
    const key = `logs_${config.debug.appBuildVersion}_${logData.type}_${logData.hash}`;
    await this.setSecureKeyValue(key, JSON.stringify(logData));
  }

  async getLogs(logType: string): Promise<any[]> {
    const logs = [];
    const keys = await SecureStore.getItemAsync('keys');
    if (keys) {
      for (const key of keys) {
        if (key.includes(`logs_${config.debug.appBuildVersion}_${logType}`)) {
          const value = await this.getSecureKeyValue(key);
          if (value) {
            logs.push(JSON.parse(value));
          }
        }
      }
    }
    logs.sort((a, b) => b.time - a.time);
    return logs;
  }

  async removeLogs(logType: string): Promise<void> {
    const keys = await SecureStore.getItemAsync('keys');
    if (keys) {
      for (const key of keys) {
        if (key.includes(`logs_${config.debug.appBuildVersion}_${logType}`)) {
          await this.removeSecureKeyValue(key);
        }
      }
    }
  }
}

export default new AirDAOKeys();
