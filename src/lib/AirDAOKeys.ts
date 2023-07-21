import * as SecureStore from 'expo-secure-store';
import KeysUtills from '@utils/keys';
import config from '@constants/config';
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

class AirDAOKeys {
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

  // TODO discoverAddresses

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
