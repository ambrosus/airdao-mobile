import { useCallback, useEffect, useState } from 'react';
import { Token } from '@models';
import { TransactionUtils } from '@utils';

export const useEstimatedTransferFee = (
  token: Token,
  etherAmount: number,
  addressFrom: string,
  addressTo: string
) => {
  const [estimatedFee, setEstimatedFee] = useState(0);

  const getFee = useCallback(async () => {
    try {
      const fee = await TransactionUtils.getEstimatedFee(
        addressFrom,
        addressTo,
        etherAmount,
        token
      );
      setEstimatedFee(fee);
    } catch (error) {
      setEstimatedFee(0);
    }
  }, [addressFrom, addressTo, etherAmount, token]);

  useEffect(() => {
    if (token && etherAmount > 0 && addressFrom && addressTo) getFee();
  }, [token, etherAmount, addressFrom, addressTo, getFee]);

  return estimatedFee;
};
