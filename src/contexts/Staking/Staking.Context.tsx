import { useCallback, useMemo, useState } from 'react';
import { ReturnedPoolDetails } from '@api/staking/types';
import { staking } from '@api/staking/staking-service';
import { createContextSelector } from '@utils/createContextSelector';

export const StakingContext = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [poolsStakingDetails, setPoolsStakingDetails] = useState<
    ReturnedPoolDetails[]
  >([]);

  const fetchPoolDetails = useCallback(async (selectedWallet: string) => {
    try {
      setIsFetching(true);
      const response = await staking.getStakingPoolsDetails({
        address: selectedWallet
      });

      if (response) setPoolsStakingDetails(response);
    } finally {
      setIsFetching(false);
    }
  }, []);

  const usePoolDetailsByName = (poolName: string) => {
    return useMemo(() => {
      const transformedCurrentPoolName = poolName.split(' ')[0];
      return poolsStakingDetails?.find(
        (pool) => pool.contractName === transformedCurrentPoolName
      );
    }, [poolName]);
  };

  return {
    fetchPoolDetails,
    usePoolDetailsByName,
    isFetching
  };
};

export const [StakingContextProvider, useStakingContext] =
  createContextSelector(StakingContext);

export const useStakingMultiplyContextSelector = () =>
  useStakingContext((v) => v);

export const usePoolDetailsByName = (poolName: string) =>
  useStakingContext((v) => v.usePoolDetailsByName(poolName));
