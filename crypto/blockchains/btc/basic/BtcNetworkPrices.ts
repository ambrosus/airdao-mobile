/* eslint-disable camelcase */
/**
 * @version 0.20
 **/
import { AirDAOBlockchainTypes } from '../../AirDAOBlockchainTypes';
import AirDAOCryptoLog from '../../../common/AirDAOCryptoLog';
import AirDAOAxios from '../../../common/AirDAOAxios';
import BlocksoftExternalSettings from '../../../common/AirDAOExternalSettings';

import BlocksoftUtils from '../../../common/AirDAOUtils';

const ESTIMATE_PATH = 'https://mempool.space/api/v1/fees/recommended';

const CACHE_VALID_TIME = 60000; // 1 minute

let CACHE_FEES_BTC_TIME = 0;
let CACHE_FEES_BTC = {
  speed_blocks_2: 0,
  speed_blocks_6: 0,
  speed_blocks_12: 0
};

let CACHE_PREV_DATA = {
  fastestFee: 19,
  halfHourFee: 3,
  hourFee: 2,
  lastBlock: 0,
  timeFromBlock: 0,
  timeFromBlockDiff: 0,
  mempoolSize: 0
};

let CACHE_PREV_PREV_DATA = {
  fastestFee: 19,
  halfHourFee: 3,
  hourFee: 2,
  lastBlock: 0,
  timeFromBlock: 0,
  timeFromBlockDiff: 0,
  mempoolSize: 0
};

export default class BtcNetworkPrices
  implements AirDAOBlockchainTypes.NetworkPrices
{
  private _trezorServerCode = 'BTC_TREZOR_SERVER';
  private _trezorServer: any;

  async getNetworkPrices(currencyCode: string): Promise<{
    speed_blocks_2: number;
    speed_blocks_6: number;
    speed_blocks_12: number;
  }> {
    AirDAOCryptoLog.log('BtcNetworkPricesProvider ' + currencyCode);
    const logData = {
      currencyCode,
      source: 'fromCache',
      cacheTime: CACHE_FEES_BTC_TIME + '',
      fee: JSON.stringify(CACHE_FEES_BTC)
    };
    const now = new Date().getTime();
    if (CACHE_FEES_BTC && now - CACHE_FEES_BTC_TIME < CACHE_VALID_TIME) {
      // @ts-ignore
      AirDAOCryptoLog.log(
        'BtcNetworkPricesProvider ' +
          currencyCode +
          ' used cache ' +
          JSON.stringify(CACHE_FEES_BTC)
      );
      return CACHE_FEES_BTC;
    }

    AirDAOCryptoLog.log(
      'BtcNetworkPricesProvider ' + currencyCode + ' no cache load'
    );

    let link = `${ESTIMATE_PATH}`;
    let timeFromBlock = false;
    let timeFromBlockDiff = false;
    let lastBlock = 0;
    let mempoolSize = 0;
    if (currencyCode !== 'BTC_TEST') {
      this._trezorServer = await BlocksoftExternalSettings.getTrezorServer(
        this._trezorServerCode,
        'BTC.NetworkPrices'
      );
      const linkTrezor = this._trezorServer + '/api/';

      let tmp = false;
      try {
        tmp = await AirDAOAxios.getWithoutBraking(linkTrezor);
        if (tmp && tmp.data) {
          lastBlock = tmp.data.blockbook.bestHeight;
          mempoolSize = tmp.data.blockbook.mempoolSize;
          timeFromBlock = tmp.data.blockbook.lastBlockTime;
          timeFromBlockDiff = now - new Date(timeFromBlock).getTime();
        }
      } catch (e) {}

      AirDAOCryptoLog.log(
        'BtcNetworkPricesProvider lastBlock ' +
          lastBlock +
          ' mempool ' +
          mempoolSize +
          ' timeFromBlock ' +
          timeFromBlock +
          ' diff ' +
          timeFromBlockDiff
      );

      tmp = false;
      try {
        tmp = await AirDAOAxios.getWithoutBraking(link);
        if (tmp && tmp.data) {
          logData.source = 'reloaded';
          if (lastBlock > CACHE_PREV_DATA.lastBlock) {
            CACHE_PREV_PREV_DATA = CACHE_PREV_DATA;
          }
          CACHE_PREV_DATA = tmp.data;
          CACHE_PREV_DATA.lastBlock = lastBlock;
          CACHE_PREV_DATA.mempoolSize = mempoolSize;
          CACHE_PREV_DATA.timeFromBlock = timeFromBlock;
          CACHE_PREV_DATA.timeFromBlockDiff = timeFromBlockDiff;
        } else {
          logData.source = 'fromLoadCache';
          link = 'prev';
        }
      } catch (e) {
        // do nothing
      }
    }
    // @ts-ignore
    AirDAOCryptoLog.log('BtcNetworkPricesProvider CACHE_FEES', {
      CACHE_PREV_DATA,
      CACHE_PREV_PREV_DATA,
      ...logData
    });

    try {
      const cachedWithTime = CACHE_PREV_DATA;
      if (timeFromBlock) {
        if (timeFromBlockDiff < 1000 && cachedWithTime.fastestFee === '4') {
          // 1 minute from block
          if (cachedWithTime.fastestFee < CACHE_PREV_PREV_DATA.fastestFee) {
            cachedWithTime.fastestFee = CACHE_PREV_PREV_DATA.fastestFee;
            // @ts-ignore
            AirDAOCryptoLog.log(
              'BtcNetworkPricesProvider change as block 1 minute ago and fastest no ok - used prev ',
              CACHE_PREV_PREV_DATA
            );
          } else if (CACHE_PREV_DATA.mempoolSize < 10000) {
            cachedWithTime.fastestFee = cachedWithTime.fastestFee * 1.5;
            AirDAOCryptoLog.log(
              'BtcNetworkPricesProvider change as block 1 minute ago and fastest no ok - mempool is small'
            );
          } else {
            cachedWithTime.fastestFee = cachedWithTime.fastestFee * 3;
            AirDAOCryptoLog.log(
              'BtcNetworkPricesProvider change as block 1 minute ago and fastest no ok - mempool is ok'
            );
          }
        } else if (timeFromBlockDiff < 5000) {
          // 2 minute from block
          if (cachedWithTime.fastestFee < CACHE_PREV_PREV_DATA.fastestFee) {
            cachedWithTime.fastestFee = CACHE_PREV_PREV_DATA.fastestFee;
            // @ts-ignore
            AirDAOCryptoLog.log(
              'BtcNetworkPricesProvider change as block 5 minute ago and fastest no ok - used prev ',
              CACHE_PREV_PREV_DATA
            );
          }
        }
      }
      await this._parseLoaded(currencyCode, cachedWithTime, link);
    } catch (e) {
      // do nothing
    }
    return CACHE_FEES_BTC;
  }

  async _parseLoaded(
    currencyCode: string,
    json: {
      fastestFee: any;
      halfHourFee: any;
      hourFee: any;
      lastBlock?: number;
      timeFromBlock?: number;
      timeFromBlockDiff?: number;
      mempoolSize?: number;
    },
    link: string
  ) {
    CACHE_FEES_BTC = {
      speed_blocks_2: 0,
      speed_blocks_6: 0,
      speed_blocks_12: 0
    };

    const externalSettings = await BlocksoftExternalSettings.getAll(
      'BTC.getNetworkPrices'
    );
    addMultiply(2, json.fastestFee * 1, externalSettings);
    addMultiply(6, json.halfHourFee * 1, externalSettings);
    addMultiply(12, json.hourFee * 1, externalSettings);

    if (CACHE_FEES_BTC.speed_blocks_2 === 1) {
      CACHE_FEES_BTC.speed_blocks_2 = 4;
    }
    if (CACHE_FEES_BTC.speed_blocks_6 === CACHE_FEES_BTC.speed_blocks_2) {
      if (CACHE_FEES_BTC.speed_blocks_12 === CACHE_FEES_BTC.speed_blocks_6) {
        CACHE_FEES_BTC.speed_blocks_6 = Math.round(
          CACHE_FEES_BTC.speed_blocks_6 / 2
        );
        CACHE_FEES_BTC.speed_blocks_12 = Math.round(
          CACHE_FEES_BTC.speed_blocks_6 / 2
        );
      } else {
        CACHE_FEES_BTC.speed_blocks_6 = Math.round(
          CACHE_FEES_BTC.speed_blocks_2 / 2
        );
      }
    } else if (
      CACHE_FEES_BTC.speed_blocks_12 === CACHE_FEES_BTC.speed_blocks_6
    ) {
      CACHE_FEES_BTC.speed_blocks_12 = Math.round(
        CACHE_FEES_BTC.speed_blocks_6 / 2
      );
    }

    if (
      CACHE_FEES_BTC.speed_blocks_12 === 0 ||
      CACHE_FEES_BTC.speed_blocks_6 === 1
    ) {
      CACHE_FEES_BTC.speed_blocks_12 = 1;
      if (CACHE_FEES_BTC.speed_blocks_6 === 1) {
        CACHE_FEES_BTC.speed_blocks_6 = 2;
      }
    }

    if (CACHE_FEES_BTC.speed_blocks_6 < CACHE_FEES_BTC.speed_blocks_12) {
      const t = CACHE_FEES_BTC.speed_blocks_6;
      CACHE_FEES_BTC.speed_blocks_6 = CACHE_FEES_BTC.speed_blocks_12;
      CACHE_FEES_BTC.speed_blocks_12 = t;
    }

    if (CACHE_FEES_BTC.speed_blocks_2 < CACHE_FEES_BTC.speed_blocks_6) {
      const t = CACHE_FEES_BTC.speed_blocks_6;
      CACHE_FEES_BTC.speed_blocks_6 = CACHE_FEES_BTC.speed_blocks_2;
      CACHE_FEES_BTC.speed_blocks_2 = t;
    }

    if (CACHE_FEES_BTC.speed_blocks_6 < CACHE_FEES_BTC.speed_blocks_12) {
      const t = CACHE_FEES_BTC.speed_blocks_6;
      CACHE_FEES_BTC.speed_blocks_6 = CACHE_FEES_BTC.speed_blocks_12;
      CACHE_FEES_BTC.speed_blocks_12 = t;
    }

    CACHE_FEES_BTC_TIME = new Date().getTime();
    if (CACHE_FEES_BTC.speed_blocks_2 > 0) {
      AirDAOCryptoLog.log(
        'BtcNetworkPricesProvider ' + currencyCode + ' new cache fees',
        CACHE_FEES_BTC
      );
    } else {
      // noinspection ES6MissingAwait
    }
  }
}

function addMultiply(blocks, fee, externalSettings) {
  const key = 'speed_blocks_' + blocks;
  if (
    typeof externalSettings['BTC_CURRENT_PRICE_' + blocks] !== 'undefined' &&
    externalSettings['BTC_CURRENT_PRICE_' + blocks] > 0
  ) {
    CACHE_FEES_BTC[key] = externalSettings['BTC_CURRENT_PRICE_' + blocks];
  } else if (
    typeof externalSettings['BTC_MULTI_V3_' + blocks] !== 'undefined' &&
    externalSettings['BTC_MULTI_V3_' + blocks] > 0
  ) {
    CACHE_FEES_BTC[key] =
      BlocksoftUtils.mul(fee, externalSettings['BTC_MULTI_V3_' + blocks]) * 1;
  } else if (
    typeof externalSettings.BTC_MULTI_V3 !== 'undefined' &&
    externalSettings.BTC_MULTI_V3 > 0
  ) {
    CACHE_FEES_BTC[key] =
      BlocksoftUtils.mul(fee, externalSettings.BTC_MULTI_V3) * 1;
    AirDAOCryptoLog.log('BtcNetworkPricesProvider addMultiply result', {
      blocks,
      fee,
      mul: externalSettings.BTC_MULTI_V3,
      res: CACHE_FEES_BTC[key]
    });
  } else {
    CACHE_FEES_BTC[key] = fee;
  }
  if (
    typeof externalSettings['BTC_MIN_' + blocks] !== 'undefined' &&
    externalSettings['BTC_MIN_' + blocks] > 0
  ) {
    if (externalSettings['BTC_MIN_' + blocks] > CACHE_FEES_BTC[key]) {
      CACHE_FEES_BTC[key] = externalSettings['BTC_MIN_' + blocks];
    }
  } else if (
    typeof externalSettings.BTC_MIN !== 'undefined' &&
    externalSettings.BTC_MIN > 0
  ) {
    if (externalSettings.BTC_MIN > CACHE_FEES_BTC[key]) {
      CACHE_FEES_BTC[key] = externalSettings.BTC_MIN;
    }
  }
}
