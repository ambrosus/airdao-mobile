/**
 * @version 0.50
 */
import BlocksoftExternalSettings from '@crypto/common/AirDAOExternalSettings';
import AirDAOAxios from '@crypto/common/AirDAOAxios';
import AirDAOCryptoLog from '@crypto/common/AirDAOCryptoLog';

interface TransactionData {
  data: any;
  time: number;
}

const CACHE_OF_TRANSACTIONS: Record<string, Record<string, TransactionData>> = {
  ASH: {},
  WAVES: {}
};

const CACHE_VALID_TIME = 30000; // 30 seconds

export default class WavesTransactionsProvider {
  async get(address: string, mainCurrencyCode: string): Promise<any> {
    let _apiPath: string;

    if (mainCurrencyCode === 'ASH') {
      _apiPath = await BlocksoftExternalSettings.get('ASH_SERVER');
    } else {
      _apiPath = await BlocksoftExternalSettings.get('WAVES_SERVER');
    }

    const now = new Date().getTime();

    if (
      CACHE_OF_TRANSACTIONS[mainCurrencyCode] &&
      CACHE_OF_TRANSACTIONS[mainCurrencyCode][address] &&
      now - CACHE_OF_TRANSACTIONS[mainCurrencyCode][address].time <
        CACHE_VALID_TIME
    ) {
      if (CACHE_OF_TRANSACTIONS[mainCurrencyCode][address]) {
        AirDAOCryptoLog.log(
          `WavesTransactionsProvider.get from cache ${address} => ${mainCurrencyCode}`
        );
        return CACHE_OF_TRANSACTIONS[mainCurrencyCode][address].data;
      }
    }

    const link = `${_apiPath}/transactions/address/${address}/limit/100`;
    const res = await AirDAOAxios.get(link);

    // @ts-ignore
    if (!res || typeof res.data === 'undefined') {
      return false;
    }

    // @ts-ignore
    const data = res.data[0] as { data: any };

    if (!data) {
      return false;
    }

    CACHE_OF_TRANSACTIONS[mainCurrencyCode][address] = {
      data: data.data,
      time: now
    };

    return data.data;
  }
}
