/**
 * @version 0.5
 */
import AirDAOCryptoLog from '../../../common/AirDAOCryptoLog';
import AirDAOAxios from '../../../common/AirDAOAxios';
import AirDAOUtils from '../../../common/AirDAOUtils';
import AirDAOExternalSettings from '../../../common/AirDAOExternalSettings';
import EthRawDS from '../stores/EthRawDS';
import EthTmpDS from '../stores/EthTmpDS';

const ESTIMATE_PATH = 'https://ethgasstation.info/json/ethgasAPI.json';
const ESTIMATE_MAX_TRY = 50; // max tries before error appear in axios get
const MAGIC_TX_DIVIDER = 10;

const CACHE_VALID_TIME = 60000; // 1 minute
let CACHE_FEES_ETH = false;
let CACHE_FEES_ETH_TIME = 0;

let CACHE_PREV_DATA = { fastest: 100.0, safeLow: 13.0, average: 30.0 };

const CACHE_PROXY_VALID_TIME = 10000; // 10 seconds
let CACHE_PROXY_DATA = {
  result: '',
  address: ''
};
let CACHE_PROXY_TIME = 0;
class EthNetworkPrices {
  private _mainCurrencyCode: string | undefined;
  async getWithProxy(
    mainCurrencyCode: string,
    isTestnet: boolean,
    address: string,
    logData = {}
  ) {
    if (mainCurrencyCode !== 'ETH' || isTestnet) {
      return false;
    }
    // const { apiEndpoints } = config.proxy;
    // const baseURL = MarketingEvent.DATA.LOG_TESTER
    //   ? apiEndpoints.baseURLTest
    //   : apiEndpoints.baseURL;
    // const proxy = baseURL + '/eth/getFees';
    const now = new Date().getTime();
    if (
      CACHE_PROXY_DATA.address === address &&
      now - CACHE_PROXY_TIME < CACHE_PROXY_VALID_TIME
    ) {
      AirDAOCryptoLog.log(
        mainCurrencyCode + ' EthNetworkPricesProvider.getWithProxy from cache',
        // @ts-ignore
        logData
      );
      return CACHE_PROXY_DATA.result;
    }

    AirDAOCryptoLog.log(
      mainCurrencyCode + ' EthNetworkPricesProvider.getWithProxy started',
      // @ts-ignore
      logData
    );
    let checkResult = false;
    let index = 0;
    do {
      try {
        // TODO
        // checkResult = await AirDAOAxios.post(
        //   proxy,
        //   {
        //     address,
        //     logData,
        //     marketingData: MarketingEvent.DATA
        //   },
        //   20000
        // );
      } catch (e) {
        console.log({ e });
      }
      index++;
    } while (index < 3 && !checkResult);

    if (checkResult) {
      if (typeof checkResult.data !== 'undefined') {
        await AirDAOCryptoLog.log(
          mainCurrencyCode +
            ' EthNetworkPricesProvider.getWithProxy proxy checkResult1 ',
          checkResult.data
        );
        if (
          typeof checkResult.data.status === 'undefined' ||
          checkResult.data.status === 'error'
        ) {
          checkResult = false;
        } else if (checkResult.data.status === 'notice') {
          throw new Error(checkResult.data.msg);
        }
      } else {
        await AirDAOCryptoLog.log(
          mainCurrencyCode +
            ' EthNetworkPricesProvider.getWithProxy proxy checkResult2 ',
          checkResult
        );
      }
    } else {
      // TODO
    }

    if (!checkResult) {
      return {
        gasPrice: await this.getOnlyFees(
          mainCurrencyCode,
          isTestnet,
          address,
          logData
        )
      };
    }

    const result = checkResult.data;
    if (typeof result.gasPrice !== 'undefined') {
      for (const key in result.gasPrice) {
        // @ts-ignore
        result.gasPrice[key] = AirDAOUtils.div(
          AirDAOUtils.toWei(result.gasPrice[key], 'gwei'),
          MAGIC_TX_DIVIDER
        ); // in gwei to wei + magic
      }
    }
    const indexed = {};
    let updatedCache = false;
    if (typeof checkResult.data.maxScanned !== 'undefined') {
      await EthTmpDS.saveNonce(
        this._mainCurrencyCode,
        address,
        'maxScanned',
        checkResult.data.maxScanned
      );
      updatedCache = true;
    }
    if (typeof checkResult.data.maxSuccess !== 'undefined') {
      await EthTmpDS.saveNonce(
        this._mainCurrencyCode,
        address,
        'maxSuccess',
        checkResult.data.maxSuccess
      );
      updatedCache = true;
    }
    if (
      typeof checkResult.data.txsToRemove !== 'undefined' &&
      checkResult.data.txsToRemove
    ) {
      for (const transactionHash of checkResult.data.txsToRemove) {
        await EthRawDS.cleanRawHash({ transactionHash });
        indexed[transactionHash] = 1;
      }
      updatedCache = true;
    }
    if (
      typeof checkResult.data.txsToSuccess !== 'undefined' &&
      checkResult.data.txsToSuccess
    ) {
      for (const transactionHash of checkResult.data.txsToSuccess) {
        await EthTmpDS.setSuccess(transactionHash);
      }
      updatedCache = true;
    }
    if (
      typeof checkResult.data.queryTxs !== 'undefined' &&
      typeof checkResult.data.queryLength !== 'undefined'
    ) {
      updatedCache = true;
    }
    if (updatedCache) {
      result.maxNonceLocal = await EthTmpDS.getCache(
        mainCurrencyCode,
        address,
        indexed
      );
    }
    if (typeof checkResult.data.queryTxs !== 'undefined') {
      result.maxNonceLocal.queryTxs = checkResult.data.queryTxs;
    }
    if (typeof checkResult.data.queryLength !== 'undefined') {
      result.maxNonceLocal.queryLength = checkResult.data.queryLength;
    }
    CACHE_PROXY_DATA = { result, address };
    CACHE_PROXY_TIME = now;

    return result;
  }

  async getOnlyFees(
    mainCurrencyCode: string,
    isTestnet: boolean,
    address: string,
    logData = {
      resultFeeSource: '',
      resultFee: '',
      resultFeeCacheTime: CACHE_FEES_ETH_TIME
    }
  ) {
    logData.resultFeeSource = 'fromCache';
    const now = new Date().getTime();
    if (CACHE_FEES_ETH && now - CACHE_FEES_ETH_TIME < CACHE_VALID_TIME) {
      logData.resultFeeCacheTime = CACHE_FEES_ETH_TIME;
      logData.resultFee = JSON.stringify(CACHE_FEES_ETH);
      // noinspection ES6MissingAwait
      AirDAOCryptoLog.log(
        mainCurrencyCode +
          ' EthNetworkPricesProvider.getOnlyFees used cache => ' +
          JSON.stringify(CACHE_FEES_ETH)
      );
      return this._format();
    }

    AirDAOCryptoLog.log(
      mainCurrencyCode + ' EthNetworkPricesProvider.getOnlyFees no cache load'
    );

    let link = `${ESTIMATE_PATH}`;
    let tmp = false;
    try {
      tmp = await AirDAOAxios.getWithoutBraking(link, ESTIMATE_MAX_TRY);
      if (tmp.data && tmp.data.fastest) {
        if (typeof tmp.data.gasPriceRange !== 'undefined') {
          delete tmp.data.gasPriceRange;
        }
        logData.resultFeeSource = 'reloaded';
        CACHE_PREV_DATA = tmp.data;
        AirDAOCryptoLog.log(
          mainCurrencyCode +
            ' EthNetworkPricesProvider.getOnlyFees loaded new fee',
          // @ts-ignore
          CACHE_PREV_DATA
        );
      } else {
        logData.resultFeeSource = 'fromLoadCache';
        link = 'prev';
        AirDAOCryptoLog.log(
          mainCurrencyCode +
            ' EthNetworkPricesProvider.getOnlyFees loaded prev fee as no fastest',
          // @ts-ignore
          CACHE_PREV_DATA
        );
      }
    } catch (e) {
      AirDAOCryptoLog.log(
        mainCurrencyCode +
          ' EthNetworkPricesProvider.getOnlyFees loaded prev fee as error',
        // @ts-ignore
        CACHE_PREV_DATA
      );
      // do nothing
    }

    try {
      await this._parseLoaded(mainCurrencyCode, CACHE_PREV_DATA, link);
    } catch (e: any) {
      AirDAOCryptoLog.log(
        mainCurrencyCode +
          ' EthNetworkPricesProvider.getOnlyFees _parseLoaded error ' +
          e.message
      );
      // do nothing
    }
    logData.resultFeeCacheTime = CACHE_FEES_ETH_TIME;
    logData.resultFee = JSON.stringify(CACHE_FEES_ETH);
    return this._format();
  }

  _format() {
    return {
      // @ts-ignore
      speed_blocks_2: CACHE_FEES_ETH[2],
      // @ts-ignore
      speed_blocks_6: CACHE_FEES_ETH[6],
      // @ts-ignore
      speed_blocks_12: CACHE_FEES_ETH[12]
    };
  }

  /**
   * @param {int} json.safeLow
   * @param {int} json.average
   * @param {int} json.fastest
   * @private
   */
  async _parseLoaded(
    mainCurrencyCode: string,
    json: { fastest: any; safeLow: any; average: any }
  ) {
    CACHE_FEES_ETH = {};

    const externalSettings = await AirDAOExternalSettings.getAll(
      'ETH.getNetworkPrices'
    );
    addMultiply(mainCurrencyCode, 2, json.fastest * 1, externalSettings);
    addMultiply(mainCurrencyCode, 6, json.average * 1, externalSettings);
    addMultiply(mainCurrencyCode, 12, json.safeLow * 1, externalSettings);

    if (CACHE_FEES_ETH[12] === CACHE_FEES_ETH[6]) {
      if (CACHE_FEES_ETH[6] === CACHE_FEES_ETH[2]) {
        CACHE_FEES_ETH[6] = Math.round(CACHE_FEES_ETH[12] * 1.1);
        CACHE_FEES_ETH[2] = Math.round(CACHE_FEES_ETH[6] * 1.1);
      } else {
        CACHE_FEES_ETH[6] = Math.round(CACHE_FEES_ETH[12] * 1.1);
      }
    } else if (CACHE_FEES_ETH[6] === CACHE_FEES_ETH[2]) {
      CACHE_FEES_ETH[2] = Math.round(CACHE_FEES_ETH[6] * 1.1);
    }
    if (CACHE_FEES_ETH[6] > CACHE_FEES_ETH[2]) {
      const tmp = CACHE_FEES_ETH[6];
      CACHE_FEES_ETH[6] = CACHE_FEES_ETH[2];
      CACHE_FEES_ETH[2] = tmp;
    }

    try {
      CACHE_FEES_ETH[12] = AirDAOUtils.div(
        AirDAOUtils.toWei(CACHE_FEES_ETH[12], 'gwei'),
        MAGIC_TX_DIVIDER
      ); // in gwei to wei + magic
      CACHE_FEES_ETH[6] = AirDAOUtils.div(
        AirDAOUtils.toWei(CACHE_FEES_ETH[6], 'gwei'),
        MAGIC_TX_DIVIDER
      ); // in gwei to wei + magic
      CACHE_FEES_ETH[2] = AirDAOUtils.div(
        AirDAOUtils.toWei(CACHE_FEES_ETH[2], 'gwei'),
        MAGIC_TX_DIVIDER
      ); // in gwei to wei + magic
    } catch (e: any) {
      e.message += ' in EthPrice Magic divider';
      throw e;
    }

    CACHE_FEES_ETH_TIME = new Date().getTime();
  }
}

function addMultiply(
  mainCurrencyCode: string,
  blocks: string | number,
  fee: number,
  // @ts-ignore
  externalSettings
) {
  if (
    typeof externalSettings['ETH_CURRENT_PRICE_' + blocks] !== 'undefined' &&
    externalSettings['ETH_CURRENT_PRICE_' + blocks] > 0
  ) {
    CACHE_FEES_ETH[blocks] = externalSettings['ETH_CURRENT_PRICE_' + blocks];
    AirDAOCryptoLog.log(
      mainCurrencyCode + ' EthNetworkPricesProvider current price result',
      {
        blocks,
        fee,
        current: externalSettings['ETH_CURRENT_PRICE_' + blocks],
        res: CACHE_FEES_ETH[blocks]
      }
    );
  } else if (
    typeof externalSettings['ETH_MULTI_' + blocks] !== 'undefined' &&
    externalSettings['ETH_MULTI_' + blocks] > 0
  ) {
    CACHE_FEES_ETH[blocks] = AirDAOUtils.mul(
      fee,
      externalSettings['ETH_MULTI_' + blocks]
    );
    AirDAOCryptoLog.log(
      mainCurrencyCode +
        ' EthNetworkPricesProvider addMultiply' +
        blocks +
        ' result',
      {
        blocks,
        fee,
        mul: externalSettings['ETH_MULTI_' + blocks],
        res: CACHE_FEES_ETH[blocks]
      }
    );
  } else if (
    typeof externalSettings.ETH_MULTI !== 'undefined' &&
    externalSettings.ETH_MULTI > 0
  ) {
    CACHE_FEES_ETH[blocks] =
      AirDAOUtils.mul(fee, externalSettings.ETH_MULTI) * 1;
    AirDAOCryptoLog.log(
      mainCurrencyCode + ' EthNetworkPricesProvider addMultiply result',
      {
        blocks,
        fee,
        mul: externalSettings.ETH_MULTI,
        res: CACHE_FEES_ETH[blocks]
      }
    );
  } else {
    CACHE_FEES_ETH[blocks] = fee;
  }
  if (
    typeof externalSettings['ETH_MIN_' + blocks] !== 'undefined' &&
    externalSettings['ETH_MIN_' + blocks] > 0
  ) {
    if (externalSettings['ETH_MIN_' + blocks] > CACHE_FEES_ETH[blocks]) {
      CACHE_FEES_ETH[blocks] = externalSettings['ETH_MIN_' + blocks];
    }
  } else if (
    typeof externalSettings.ETH_MIN !== 'undefined' &&
    externalSettings.ETH_MIN > 0
  ) {
    if (externalSettings.ETH_MIN > CACHE_FEES_ETH[blocks]) {
      CACHE_FEES_ETH[blocks] = externalSettings.ETH_MIN;
    }
  }
}

const singleton = new EthNetworkPrices();
export default singleton;
