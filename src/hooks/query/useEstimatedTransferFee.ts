import { useCallback, useEffect, useState } from 'react';
import { AirDAOTransferDispatcher } from '@crypto/blockchains/AirDAOTransferDispatcher';
import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';
import AirDAOUtils from '@crypto/common/AirDAOUtils';

export const useEstimatedTransferFee = (
  currency: AirDAODictTypes.Code,
  etherAmount: number,
  addressFrom: string,
  addressTo: string,
  walletHash: string
) => {
  const [estimatedFee, setEstimatedFee] = useState(0);

  const getFee = useCallback(async () => {
    try {
      const processor = AirDAOTransferDispatcher.getTransferProcessor(currency);
      const feeRate = await processor.getFeeRate({
        currencyCode: currency,
        walletHash,
        derivationPath: '',
        addressFrom,
        addressTo,
        amount: AirDAOUtils.toWei(etherAmount).toString(),
        useOnlyConfirmed: false,
        allowReplaceByFee: false,
        useLegacy: 0,
        isHd: false,
        accountBalanceRaw: '',
        isTransferAll: false
      });
      const fees = feeRate.fees;
      if (fees.length > 0) {
        const fee = fees[0];
        if (fee.gasLimit && fee.gasPrice) {
          const estimatedFee = Number(fee.gasPrice) * Number(fee.gasLimit);
          setEstimatedFee(parseFloat(AirDAOUtils.toEther(estimatedFee)));
        }
      }
    } catch (error) {
      // TODO ignore
    }
  }, [addressFrom, addressTo, currency, etherAmount, walletHash]);

  useEffect(() => {
    if (currency && etherAmount > 0 && addressFrom && addressTo && walletHash)
      getFee();
  }, [currency, etherAmount, addressFrom, addressTo, walletHash, getFee]);

  return estimatedFee;
};
