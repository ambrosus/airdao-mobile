/* eslint-disable @typescript-eslint/no-namespace */
/**
 * @version 0.41
 */
import { useSendCryptoContext } from '../SendCrypto.context';
import { SendActionsBlockchainWrapper } from './SendActionsBlockchainWrapper';

let CACHE_SELECTED_FEE = false;

export const useSendActionsUpdateValues = () => {
  const { state, reducer: dispatch } = useSendCryptoContext((v) => v);
  const setStepOne = (data: {
    cryptoValue: string;
    addressTo: string;
    addressName: string;
    memo: string;
    isTransferAll: boolean;
  }) => {
    dispatch({
      type: 'SET_DATA',
      ui: data
    });
  };

  const setDict = (
    dictNew: {
      balanceRaw: number;
      addressFrom?: string;
      currencyCode?: string;
    } = { balanceRaw: 0 }
  ) => {
    const { dict } = state;
    if (!dict) return;
    if (
      dict.addressFrom === dictNew.addressFrom &&
      dict.currencyCode === dictNew.currencyCode
    ) {
      dispatch({
        type: 'SET_DATA',
        dict: dictNew
      });
    }
  };

  const setCommentAndFeeFromTmp = async (comment: string, rawOnly = false) => {
    if (!CACHE_SELECTED_FEE) {
      dispatch({
        type: 'SET_DATA',
        ui: {
          comment,
          rawOnly,
          cryptoValueRecounted: 0
        }
      });
    } else {
      const ui = {
        comment,
        rawOnly,
        cryptoValueRecounted: 0
      };

      let newFee = false;
      if (
        typeof CACHE_SELECTED_FEE.isCustomFee !== 'undefined' &&
        CACHE_SELECTED_FEE.isCustomFee
      ) {
        const countedCustomFee =
          await SendActionsBlockchainWrapper.getCustomFeeRate(
            CACHE_SELECTED_FEE
          );
        if (countedCustomFee) {
          newFee = countedCustomFee;
          newFee.isCustomFee = true;
        }
      } else {
        newFee = CACHE_SELECTED_FEE;
      }
      if (
        newFee &&
        typeof newFee.amountForTx !== 'undefined' &&
        newFee.amountForTx
      ) {
        // @ts-ignore
        ui.cryptoValue = newFee.amountForTx;
        ui.cryptoValueRecounted = new Date().getTime();
      }
      dispatch({
        type: 'SET_DATA',
        ui,
        fromBlockchain: {
          selectedFee: newFee
        }
      });
    }
  };

  const setTmpSelectedFee = (selectedFee: any) => {
    CACHE_SELECTED_FEE = selectedFee;
  };

  const SendActionsUpdateValues = {
    setStepOne,
    setCommentAndFeeFromTmp,
    setDict,
    setTmpSelectedFee
  };

  return SendActionsUpdateValues;
};
