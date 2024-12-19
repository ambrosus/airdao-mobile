import * as SecureStore from 'expo-secure-store';

class AirDAOKeysStorage {
  private serviceName = '';
  private serviceWalletsCounter = 0;
  private serviceWallets: { [key: string]: string } = {};
  private serviceWasInitialized = false;
  public publicWallets: string[] = [];
  public publicSelectedWallet: string | false = false;

  constructor(serviceName = 'AirDAOStorage') {
    this.serviceName = serviceName;
  }

  private sanitizeKey(key: string): string {
    return key.replace(/[^A-Za-z0-9._-]/g, '_');
  }

  private async _getServiceName(name: string) {
    this.serviceName = name;
    this.serviceWasInitialized = false;
    await this.init();
  }

  private async getKeyValue(key: string): Promise<any> {
    try {
      const sanitizedKey = this.sanitizeKey(this.serviceName + '_' + key);
      const credentials = await SecureStore.getItemAsync(sanitizedKey);
      if (!credentials) return false;
      return JSON.parse(credentials);
    } catch (e) {
      console.error('AirDAOStorage getKeyValue error ', e);
      return false;
    }
  }

  private async setKeyValue(key: string, data: any): Promise<boolean> {
    try {
      const sanitizedKey = this.sanitizeKey(this.serviceName + '_' + key);
      await SecureStore.setItemAsync(sanitizedKey, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('AirDAOStorage setKeyValue error ', e);
      if (key.indexOf('wallet') !== -1) {
        throw e;
      }
      return false;
    }
  }

  private async init() {
    if (this.serviceWasInitialized) {
      return true;
    }
    const count = await this.getKeyValue('wallets_counter');
    this.serviceWalletsCounter = count;
    this.serviceWallets = {};
    this.publicWallets = [];
    this.publicSelectedWallet = false;
    if (this.serviceWalletsCounter > 0) {
      for (let i = 1; i <= this.serviceWalletsCounter; i++) {
        const wallet = await this.getKeyValue('wallet_' + i);
        if (
          !wallet ||
          !wallet.mnemonic ||
          wallet.mnemonic === '' ||
          wallet.mnemonic ===
            'new wallet is not generated - please reinstall and restart' ||
          wallet.mnemonic === wallet.hash
        ) {
          continue;
        }
        this.serviceWallets[wallet.hash] = wallet.mnemonic;
        this.serviceWallets[i - 1] = wallet.mnemonic;
        this.publicWallets.push(wallet.hash);
      }
    }
    this.serviceWasInitialized = true;
  }

  async getOldSelectedWallet() {
    await this.init();
    const tmp = await this.getKeyValue('selected_hash');
    let publicSelectedWallet: string | boolean = false;
    if (tmp && tmp.hash) {
      publicSelectedWallet = tmp.hash;
    }
    if (
      !this.publicSelectedWallet ||
      !this.serviceWallets[this.publicSelectedWallet]
    ) {
      publicSelectedWallet = false;
    }
    return publicSelectedWallet;
  }

  async reInit() {
    this.serviceWasInitialized = false;
    return this.init();
  }

  async getOneWalletText(
    walletHash: string,
    discoverPath: string | false,
    currencyCode: string
  ) {
    try {
      if (typeof discoverPath === 'undefined' || discoverPath === false) {
        const res = await this.getKeyValue(walletHash);
        if (!res) return false;
        return res.mnemonic;
      } else {
        const key = this.getAddressCacheKey(
          walletHash,
          discoverPath,
          currencyCode
        );
        return this.getAddressCache(key);
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  }

  async getAllWalletsText() {
    let res = '';
    for (let i = 1; i <= 3; i++) {
      try {
        const wallet = await this.getKeyValue('wallet_' + i);
        if (
          wallet &&
          typeof wallet.mnemonic !== 'undefined' &&
          wallet.mnemonic !== 'undefined'
        ) {
          res += ' WALLET#' + i + ' ' + wallet.mnemonic;
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (res === '') {
      return 'Nothing found by general search';
    }
    return res;
  }

  async countMnemonics() {
    await this.init();
    return this.serviceWalletsCounter;
  }

  async getWallets() {
    await this.init();
    return this.publicWallets;
  }

  async getWalletMnemonic(hashOrId: string, source = 'default') {
    await this.init();
    if (!this.serviceWallets[hashOrId]) {
      throw new Error(
        'undefined wallet with hash ' + hashOrId + ' source ' + source
      );
    }
    return this.serviceWallets[hashOrId];
  }

  async isMnemonicAlreadySaved(newMnemonic: {
    mnemonic: string;
    hash: string;
  }) {
    await this.init();
    if (
      typeof this.serviceWallets[newMnemonic.hash] === 'undefined' ||
      !this.serviceWallets[newMnemonic.hash]
    ) {
      return false;
    }
    if (this.serviceWallets[newMnemonic.hash] !== newMnemonic.mnemonic) {
      throw new Error('something wrong with hash algorithm');
    }
    return true;
  }

  async saveMnemonic(newMnemonic: {
    mnemonic: string;
    hash: string;
    name: string;
    number: number;
  }) {
    await this.init();

    const logData = { ...newMnemonic };
    if (typeof logData.mnemonic !== 'undefined') logData.mnemonic = '***';
    if (!newMnemonic.hash) {
      throw new Error('unique hash required ' + JSON.stringify(newMnemonic));
    }
    if (
      typeof this.serviceWallets[newMnemonic.hash] !== 'undefined' &&
      this.serviceWallets[newMnemonic.hash]
    ) {
      if (this.serviceWallets[newMnemonic.hash] !== newMnemonic.mnemonic) {
        throw new Error('something wrong with hash algorithm');
      }
      return newMnemonic.hash;
    }
    this.serviceWalletsCounter++;

    const unique = newMnemonic.hash;

    await this.setKeyValue(unique, newMnemonic);
    await this.setKeyValue('wallet_' + this.serviceWalletsCounter, newMnemonic);
    await this.setKeyValue('wallets_counter', this.serviceWalletsCounter);
    this.serviceWallets[unique] = newMnemonic.mnemonic;
    this.serviceWallets[this.serviceWalletsCounter - 1] = newMnemonic.mnemonic;

    this.publicWallets.push(unique);
    this.publicSelectedWallet = unique;

    return newMnemonic.hash;
  }

  getAddressCacheKey(
    walletHash: string,
    discoverPath: string,
    currencyCode: string
  ) {
    return walletHash + '_' + discoverPath + '_' + currencyCode;
  }

  async getAddressCache(hashOrId: string) {
    try {
      const res = await this.getKeyValue('ar4_' + hashOrId);
      if (!res || !res.mnemonic || res.address === res.mnemonic) return false;
      return { address: res.address, privateKey: res.mnemonic };
    } catch (e) {
      return false;
    }
  }

  async setAddressCache(
    hashOrId: string,
    res: {
      address: string;
      privateKey: string;
      name: string;
      mnemonic: string;
      number: number;
      hash: string;
    }
  ) {
    if (typeof res.privateKey === 'undefined' || !res.privateKey) {
      return false;
    }
    return this.setKeyValue('ar4_' + hashOrId, res.address);
  }

  async setSettingValue(hashOrId: string) {
    return this.setKeyValue('setting_' + hashOrId, hashOrId);
  }

  async getSettingValue(hashOrId: string) {
    const res = await this.getKeyValue('setting_' + hashOrId);
    if (!res) return '0';
    return res.number.toString();
  }
}

export const singleAirDAOStorage = new AirDAOKeysStorage();
