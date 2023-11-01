/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * @author Javid
 * @version 0.5
 */
import AirDAODict from '@crypto/common/AirDAODict';
// @ts-ignore
// import BlocksoftKeysScam from '@crypto/actions/BlocksoftKeys/BlocksoftKeysScam';
import AirDAODispatcher from '@crypto/blockchains/AirDAODispatcher';
import networksConstants from '@crypto/common/ext/networks-constants';
import bip44Constants from '@crypto/common/ext/bip44-constants';
import { getRandomBytes } from 'expo-crypto';
import KeysUtills from '@utils/keys';

const bip32 = require('bip32');
const bip39 = require('bip39');
const bs58check = require('bs58check');

interface CacheRoots {
  [key: string]: any;
}
const ETH_CACHE: CacheRoots = {};
const CACHE: CacheRoots = {};
const CACHE_ROOTS: CacheRoots = {};
class AirDAOKeys {
  _bipHex: { [key: string]: string };
  _getRandomBytesFunction;
  constructor() {
    this._bipHex = {};
    let currency;
    for (currency of bip44Constants) {
      this._bipHex[currency[1]] = currency[0];
    }
    this._getRandomBytesFunction = getRandomBytes;
  }

  /**
   * create new mnemonic object (also gives hash to store in public db)
   * @param {int} size
   * @return {Promise<{mnemonic: string, hash: string}>}
   */
  async newMnemonic(size = 256) {
    /* let mnemonic = false
        if (USE_TON) {
            for (let i = 0; i < 10000; i++) {
                let random = await this._getRandomBytesFunction(size / 8)
                random = Buffer.from(random, 'base64')
                let testMnemonic = bip39.entropyToMnemonic(random)
                if (await BlocksoftKeysUtils.tonCheckRevert(testMnemonic)) {
                    mnemonic = testMnemonic
                    break
                }
            }
            if (!mnemonic) {
                throw new Error('TON Mnemonic is not validating')
            }
        } else {
            let random = await this._getRandomBytesFunction(size / 8)
            random = Buffer.from(random, 'base64')
            mnemonic = bip39.entropyToMnemonic(random)
        } */
    let random = await this._getRandomBytesFunction(size / 8);
    // @ts-ignore
    random = Buffer.from(random, 'base64');
    const mnemonic = bip39.entropyToMnemonic(random);
    const hash = KeysUtills.hashMnemonic(mnemonic);
    return { mnemonic, hash };
  }

  /**
   * @param {string} mnemonic
   * @return {Promise<boolean>}
   */
  // async validateMnemonic(mnemonic: string): Promise<boolean> {
  //   if (await BlocksoftKeysScam.isScamMnemonic(mnemonic)) {
  //     throw new Error('Scam import error');
  //   }
  //   const result = await bip39.validateMnemonic(mnemonic);
  //   if (!result) {
  //     throw new Error('invalid mnemonic for bip39');
  //   }
  //   return result;
  // }

  /**
   * @param {string} data.mnemonic
   * @param {string} data.walletHash
   * @param {string|string[]} data.currencyCode = all
   * @param {int} data.fromIndex = 0
   * @param {int} data.toIndex = 100
   * @param {boolean} data.fullTree = false
   * @param {array} data.derivations.BTC
   * @param {array} data.derivations.BTC_SEGWIT
   * @return {Promise<{currencyCode:[{address, privateKey, path, index, type}]}>}
   */
  async discoverAddresses(
    data: {
      mnemonic: string;
      walletHash: string;
      currencyCode: string[][] | string[];
      fromIndex: number;
      toIndex: number;
      fullTree: boolean;
      derivations?: any; // TODO
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    source: any
  ): Promise<{
    currencyCode: [
      {
        address: string;
        privateKey: string;
        path: string;
        index: number;
        type: string;
      }
    ];
  }> {
    const logData = { ...data };
    if (typeof logData.mnemonic !== 'undefined') logData.mnemonic = '***';

    let toDiscover = AirDAODict.Codes;
    if (data.currencyCode) {
      if (typeof data.currencyCode === 'string') {
        toDiscover = [data.currencyCode];
      } else {
        toDiscover = data.currencyCode as string[];
      }
    }
    const fromIndex = data.fromIndex ? data.fromIndex : 0;
    const toIndex = data.toIndex ? data.toIndex : 10;
    const fullTree = data.fullTree ? data.fullTree : false;

    const results: { [key: string]: any[] } = {};

    const mnemonicCache = data.mnemonic.toLowerCase();
    let bitcoinRoot = false;
    let currencyCode;
    let settings: any;
    const seed = await KeysUtills.bip39MnemonicToSeed(
      data.mnemonic.toLowerCase()
    );
    for (currencyCode of toDiscover) {
      results[currencyCode] = [];
      try {
        settings = AirDAODict.getCurrencyAllSettings(
          currencyCode,
          'AirDAOKeys'
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
        let root = false;
        //
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

        /**
         * @type {EthAddressProcessor|BtcAddressProcessor}
         */
        const processor = await AirDAODispatcher.innerGetAddressProcessor(
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

  async getSeedCached(mnemonic) {
    const mnemonicCache = mnemonic.toLowerCase();
    if (typeof CACHE[mnemonicCache] === 'undefined') {
      CACHE[mnemonicCache] = await KeysUtills.bip39MnemonicToSeed(
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

  getEthCached(mnemonicCache) {
    if (typeof ETH_CACHE[mnemonicCache] === 'undefined') return false;
    return ETH_CACHE[mnemonicCache];
  }

  setEthCached(mnemonic, result) {
    const mnemonicCache = mnemonic.toLowerCase();
    ETH_CACHE[mnemonicCache] = result;
  }

  /**
   * @param {string} data.mnemonic
   * @param {string} data.currencyCode
   * @param {string} data.derivationPath
   * @param {string} data.derivationIndex
   * @param {string} data.derivationType
   * @return {Promise<{address, privateKey}>}
   */
  async discoverOne(data) {
    const seed = await KeysUtills.bip39MnemonicToSeed(
      data.mnemonic.toLowerCase()
    );
    const root = bip32.fromSeed(seed);
    const child = root.derivePath(data.derivationPath.replace(/quote/g, "'"));
    /**
     * @type {EthAddressProcessor|BtcAddressProcessor}
     */
    const processor = await AirDAODispatcher.getAddressProcessor(
      data.currencyCode
    );
    processor.setBasicRoot(root);
    return processor.getAddress(
      child.privateKey,
      {
        derivationPath: data.derivationPath,
        derivationIndex: data.derivationIndex,
        derivationType: data.derivationType,
        publicKey: child.publicKey
      },
      data,
      seed,
      'discoverOne'
    );
  }

  /**
   * @param {string} data.mnemonic
   * @param {string} data.currencyCode
   * @return {Promise<{address, privateKey}>}
   */
  async discoverXpub(data) {
    const seed = await KeysUtills.bip39MnemonicToSeed(
      data.mnemonic.toLowerCase()
    );
    const root = bip32.fromSeed(seed);
    let path = `m/44'/0'/0'`;
    let version = 0x0488b21e; // xpub
    if (data.currencyCode === 'BTC_SEGWIT') {
      path = `m/84'/0'/0'`;
      version = 0x04b24746; // https://github.com/satoshilabs/slips/blob/master/slip-0132.md
    } else if (data.currencyCode === 'BTC_SEGWIT_COMPATIBLE') {
      path = `m/49'/0'/0'`;
      version = 0x049d7cb2;
    }
    const rootWallet = root.derivePath(path);
    const res = bs58check.encode(
      serialize(rootWallet, version, rootWallet.publicKey)
    );
    return res;
  }
}

function serialize(hdkey, version, key, LEN = 78) {
  // => version(4) || depth(1) || fingerprint(4) || index(4) || chain(32) || key(33)
  const buffer = Buffer.allocUnsafe(LEN);

  buffer.writeUInt32BE(version, 0);
  buffer.writeUInt8(hdkey.depth, 4);

  const fingerprint = hdkey.depth ? hdkey.parentFingerprint : 0x00000000;
  buffer.writeUInt32BE(fingerprint, 5);
  buffer.writeUInt32BE(hdkey.index, 9);

  hdkey.chainCode.copy(buffer, 13);
  key.copy(buffer, 45);

  return buffer;
}

const singleBlocksoftKeys = new AirDAOKeys();
export default singleBlocksoftKeys;
