import { useCallback, useEffect, useState } from 'react';
import { TransactionUtils } from '@utils/transaction';
import { TokenDTO } from '@models';

export const useEstimatedTransferFee = (
  token: TokenDTO,
  etherAmount: number,
  addressFrom: string,
  addressTo: string,
  walletHash: string
) => {
  const [estimatedFee, setEstimatedFee] = useState(0);

  const getFee = useCallback(async () => {
    try {
      const fee = await TransactionUtils.getEstimatedFee(
        walletHash,
        addressTo,
        etherAmount,
        token
      );
      setEstimatedFee(fee);
    } catch (error) {
      setEstimatedFee(0);
    }
  }, [walletHash, addressTo, etherAmount, token]);

  useEffect(() => {
    if (token && etherAmount > 0 && addressFrom && addressTo && walletHash)
      getFee();
  }, [token, etherAmount, addressFrom, addressTo, walletHash, getFee]);

  return estimatedFee;
};
