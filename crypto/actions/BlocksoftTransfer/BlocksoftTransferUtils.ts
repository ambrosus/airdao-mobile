/**
 * @author Ksu
 * @version 0.20
 */
import { AirDAODictTypes } from '../../common/AirDAODictTypes';
import { BlocksoftTransferDispatcher } from '../../blockchains/BlocksoftTransferDispatcher';
import { BlocksoftBlockchainTypes } from '../../blockchains/BlocksoftBlockchainTypes';
import BlocksoftUtils from '../../common/AirDAOUtils';

export namespace BlocksoftTransferUtils {
  export const getAddressToForTransferAll = function (data: {
    currencyCode: AirDAODictTypes.Code;
    address: string;
  }): string {
    if (data.currencyCode === AirDAODictTypes.Code.BTC_TEST) {
      return 'mjojEgUSi68PqNHoAyjhVkwdqQyLv9dTfV';
    }
    if (data.currencyCode === AirDAODictTypes.Code.XRP) {
      const tmp1 = 'rEAgA9B8U8RCkwn6MprHqE1ZfXoeGQxz4P';
      const tmp2 = 'rnyWPfJ7dk2X15N7jqwmqo3Nspu1oYiRZ3';
      return data.address === tmp1 ? tmp2 : tmp1;
    }
    if (data.currencyCode === AirDAODictTypes.Code.XLM) {
      const tmp1 = 'GCVPV3D4PAYFA7H2CHGFRTSPAHMSU4KQR4CHBUBUR4X23JUDJWHYZDYZ';
      const tmp2 = 'GAQA5FITDUZW36J6VFXAH4YDNTTDEGRNWIXHIOR3FNN4DVJCXCNHUR4E';
      return data.address === tmp1 ? tmp2 : tmp1;
    }
    return data.address;
  };

  export const checkTransferHasError = async function (
    data: BlocksoftBlockchainTypes.CheckTransferHasErrorData
  ): Promise<{ isOk: boolean; code?: string }> {
    const processor = BlocksoftTransferDispatcher.getTransferProcessor(
      data.currencyCode
    );
    if (typeof processor.checkTransferHasError === 'undefined') {
      return { isOk: true };
    }
    return processor.checkTransferHasError(data);
  };

  export const getBalanceForTransfer = function (data: {
    balance: string;
    unconfirmed: string | boolean;
    balanceStaked: string;
    currencyCode: AirDAODictTypes.Code;
  }): string {
    if (data.currencyCode === AirDAODictTypes.Code.TRX) {
      if (data.balanceStaked && data.balanceStaked !== '') {
        return BlocksoftUtils.diff(data.balance, data.balanceStaked);
      }
    }
    if (data.unconfirmed === false) {
      return data.balance;
    }
    // @ts-ignore
    if (data.unconfirmed * 1 < 0) {
      return data.balance;
    }
    if (data.currencyCode === AirDAODictTypes.Code.XRP) {
      return data.balance;
    }
    if (
      data.currencyCode === AirDAODictTypes.Code.ETH ||
      data.currencyCode.indexOf('ETH_') === 0
    ) {
      return data.balance;
    }
    if (
      data.currencyCode === AirDAODictTypes.Code.TRX ||
      data.currencyCode.indexOf('TRX_') === 0
    ) {
      return data.balance;
    }
    return BlocksoftUtils.add(data.balance, data.unconfirmed).toString();
  };
}
