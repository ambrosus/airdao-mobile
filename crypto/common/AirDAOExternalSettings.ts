import AirDAOAxios from './AirDAOAxios';
import AirDAOCryptoLog from './AirDAOCryptoLog';
import config from '@constants/config';

const MAX_CACHE_VALID_TIME = 6000000; // 100 minutes
const MIN_CACHE_VALID_TIME = 600000; // 10 minutes
let CACHE_VALID_TIME = 600000; // 10 minutes
let CACHE_TIME = 0;

interface TrezorServers {
  [key: string]: {
    okServers: string[];
    bestHeight: number;
    cacheTime: number;
    currentServerValue: string | boolean;
    currentServerIndex: number;
  };
}

interface Cache {
  [key: string]: any;
}

const TREZOR_SERVERS: TrezorServers = {};

const CACHE: Cache = {
  ETH_LONG_QUERY: 1,
  ETH_SMALL_FEE_FORCE_QUIT: 1,
  ETH_BLOCKED_BALANCE_FORCE_QUIT: 1,
  ETH_LONG_QUERY_FORCE_QUIT: 1,
  ETH_GAS_LIMIT: 120000,
  ETH_GAS_LIMIT_FORCE_QUIT: 0,
  BNB_SMART_SERVER: 'https://bsc-dataseed1.binance.org:443',
  BNB_SMART_PRICE: 10000000000,
  ETH_MIN_GAS_ERC20: 73000,
  ETH_MIN_GAS_LIMIT: 42000,
  ETH_TESTNET_PRICE: 6710000000,
  ETH_INFURA: '5e52e85aba6f483398c461c55b639a7b',
  ETH_INFURA_PROJECT_ID: 'c8b5c2ced3b041a8b55a1719b508ff08',
  ETH_TREZOR_SERVER: ['https://eth1.trezor.io', 'https://eth2.trezor.io'],
  ETH_ROPSTEN_TREZOR_SERVER: ['https://ac-dev0.net:29136'],
  ETC_TREZOR_SERVER: ['https://etcblockexplorer.com'],
  ETC_SERVER: 'https://www.ethercluster.com/etc',
  ETC_PRICE: 6710000000,
  ETC_GAS_LIMIT: 620000,
  ETH_POW_SERVER: 'https://mainnet.ethereumpow.org',
  AMB_SERVER: 'https://network.ambrosus.io',
  AMB_TREZOR_SERVER: ['https://blockbook.ambrosus.io'],
  AMB_PRICE: 5000000000,
  AMB_GAS_LIMIT: 620000,
  minCryptoErrorsVersion: 491,
  minAppErrorsVersion: 491,
  STAKING_COINS_PERCENT: {
    ETH: 5.1
  }
};

class AirDAOExternalSettings {
  async getAll(source: string): Promise<Cache> {
    await this._get('getAll ' + source);
    return CACHE;
  }

  async get(param: string, source = ''): Promise<any | false> {
    await this._get(
      'get ' + (typeof source !== 'undefined' && source ? source : param)
    );
    if (typeof CACHE[param] === 'undefined') return false;
    return CACHE[param];
  }

  getStatic(param: string, source = ''): any | false {
    if (typeof CACHE[param] === 'undefined') return false;
    return CACHE[param];
  }

  async _get(source: string): Promise<void> {
    const now = new Date().getTime();
    if (now - CACHE_TIME < CACHE_VALID_TIME) {
      return;
    }
    try {
      // TODO implement fees
      // const tmp = await ApiProxy.getAll({
      //   source: 'BlocksoftExternalSettings._get ' + source,
      //   onlyFees: true
      // });
      let tmp;

      CACHE_TIME = now;
      if (tmp && typeof tmp === 'object' && 'fees' in tmp && tmp.fees) {
        this._setCache(tmp.fees.data);
        CACHE_VALID_TIME = MIN_CACHE_VALID_TIME;
      } else {
        CACHE_VALID_TIME = MAX_CACHE_VALID_TIME;
      }
    } catch (e: any) {
      if (config.debug.appErrors) {
        console.log(
          'BlocksoftExternalSettings._get started ALL from ' +
            source +
            ' error ' +
            e.message.toString().substr(0, 150)
        );
      }
    }
  }

  _setCache(json: Cache): void {
    for (const key in json) {
      if (key === 'STAKING_COINS_PERCENT') {
        for (const key2 in json[key]) {
          CACHE[key][key2] = json[key][key2];
        }
      } else {
        CACHE[key] = json[key];
      }
    }
  }

  async setTrezorServerInvalid(
    key: string,
    server: string
  ): Promise<string | false> {
    if (typeof TREZOR_SERVERS[key] === 'undefined') {
      return false;
    }
    const cached = TREZOR_SERVERS[key];
    if (cached.currentServerValue !== server) {
      return false;
    }
    cached.currentServerIndex++;
    if (
      cached.currentServerIndex >= cached.okServers.length ||
      typeof cached.okServers[cached.currentServerIndex] === 'undefined'
    ) {
      cached.currentServerIndex = 0;
    }
    if (typeof cached.okServers[cached.currentServerIndex] !== 'undefined') {
      cached.currentServerValue = cached.okServers[cached.currentServerIndex];
    }
    if (
      typeof cached.currentServerValue === 'undefined' ||
      !cached.currentServerValue
    ) {
      AirDAOCryptoLog.err(
        'BlocksoftExternalSettings.getTrezorServer ' +
          key +
          ' setInvalid error with currentServer ' +
          JSON.stringify(TREZOR_SERVERS[key])
      );
      return CACHE[key][0];
    }
    return cached.currentServerValue;
  }

  async getTrezorServer(
    key: string,
    source: string
  ): Promise<string | boolean> {
    const now = new Date().getTime();
    if (typeof TREZOR_SERVERS[key] !== 'undefined') {
      const cached = TREZOR_SERVERS[key];
      if (now - cached.cacheTime < MIN_CACHE_VALID_TIME) {
        if (
          typeof cached.currentServerValue === 'string' ||
          (typeof cached.currentServerValue === 'boolean' &&
            cached.currentServerValue)
        ) {
          return cached.currentServerValue;
        }
        AirDAOCryptoLog.err(
          'BlocksoftExternalSettings.getTrezorServer ' +
            key +
            ' from ' +
            source +
            ' cache error with currentServer ' +
            JSON.stringify(TREZOR_SERVERS[key])
        );
        return CACHE[key][0];
      }
    }
    const servers = await this.get(key, 'inner getTrezorServer ' + key);
    let okServers: string[] = [];
    let bestHeight = 0;
    let currentServer: string | false = false;
    if (key === 'BTC_TREZOR_SERVER' || servers.length === 1) {
      okServers = servers;
      currentServer = servers[0];
    } else {
      let server;
      const allServers: { [key: string]: number } = {};
      for (server of servers) {
        if (!currentServer) {
          currentServer = server;
        }
        const current = await AirDAOAxios.getWithoutBraking(server + '/api');
        if (current && typeof current === 'object' && 'data' in current) {
          if (typeof current.data.blockbook.bestHeight !== 'undefined') {
            const tmp = current.data.blockbook.bestHeight;
            if (tmp > bestHeight) {
              bestHeight = tmp;
            }
            allServers[server] = tmp;
          } else {
            AirDAOCryptoLog.err(
              'BlocksoftExternalSettings.getTrezorServer ' +
                key +
                ' from ' +
                source +
                ' server ' +
                server +
                ' something wrong with blockbook ' +
                JSON.stringify(current.data)
            );
          }
        }
      }
      if (
        typeof TREZOR_SERVERS[key] !== 'undefined' &&
        TREZOR_SERVERS[key].bestHeight > bestHeight &&
        typeof TREZOR_SERVERS[key].currentServerValue !== 'undefined' &&
        (typeof TREZOR_SERVERS[key].currentServerValue === 'string' ||
          typeof TREZOR_SERVERS[key].currentServerValue === 'boolean') &&
        TREZOR_SERVERS[key].currentServerValue
      ) {
        TREZOR_SERVERS[key].cacheTime = now;
        return TREZOR_SERVERS[key].currentServerValue;
      }
      for (server of servers) {
        if (
          typeof allServers[server] !== 'undefined' &&
          allServers[server] === bestHeight
        ) {
          okServers.push(server);
        }
      }
    }
    if (okServers && typeof okServers[0] !== 'undefined') {
      currentServer = okServers[0];
    } else {
      // @ts-ignore
      okServers = [currentServer];
    }
    TREZOR_SERVERS[key] = {
      okServers,
      bestHeight,
      cacheTime: now,
      currentServerValue: currentServer,
      currentServerIndex: 0
    };
    if ((typeof currentServer === 'string' || true) && currentServer) {
      AirDAOCryptoLog.log(
        `'BlocksoftExternalSettings.getTrezorServer ' +
                ${key} +
                ' from ' +
                ${source} +
                ' put to cache ',
                ${JSON.stringify(TREZOR_SERVERS[key])}`
      );
      return currentServer;
    } else {
      AirDAOCryptoLog.err(
        'BlocksoftExternalSettings.getTrezorServer ' +
          key +
          ' from ' +
          source +
          ' error with currentServer ',
        JSON.stringify(TREZOR_SERVERS[key])
      );
      return CACHE[key][0];
    }
  }
}

export default new AirDAOExternalSettings();
