import { useCallback, useMemo, useState } from 'react';
import { ReturnedPoolDetails } from '@api/staking/types';
import { staking } from '@api/staking/staking-service';
import { createContextSelector } from '@utils/createContextSelector';

export const StakingContext = () => {
  const [isInitialFetching, setIsInitialFetching] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [poolsStakingDetails, setPoolsStakingDetails] = useState<
    ReturnedPoolDetails[]
  >([]);

  /**
   * Fetch details of staking pools for a selected wallet.
   *
   * @param {string} selectedWallet The address of the selected wallet.
   * @param {boolean} [isMultiply=false] Indicates whether the function is called from StakingPoolsScreen or StakingPool component. Defaults to false.
   *                                     Set to true to avoid potential bugs with loader.
   * @returns {Promise<void>} A Promise that resolves once the details are fetched and updated.
   */
  const fetchPoolDetails = useCallback(
    async (selectedWallet: string, isMultiply = false) => {
      try {
        isMultiply ? setIsInitialFetching(true) : setIsFetching(true);
        const response = await staking.getStakingPoolsDetails({
          address: selectedWallet
        });

        if (response) setPoolsStakingDetails(response);
      } finally {
        isMultiply ? setIsInitialFetching(false) : setIsFetching(false);
      }
    },
    []
  );

  const usePoolDetailsByName = (poolName: string) => {
    return useMemo(() => {
      const transformedCurrentPoolName = poolName.split(' ')[0];
      return poolsStakingDetails?.find((pool) =>
        pool.contractName.includes(transformedCurrentPoolName)
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [poolName, poolsStakingDetails]);
  };

  return {
    fetchPoolDetails,
    usePoolDetailsByName,
    isFetching,
    isInitialFetching
  };
};

export const [StakingContextProvider, useStakingContext] =
  createContextSelector(StakingContext);

export const useStakingMultiplyContextSelector = () =>
  useStakingContext((v) => v);

export const usePoolDetailsByName = (poolName: string) =>
  useStakingContext((v) => v.usePoolDetailsByName(poolName));
