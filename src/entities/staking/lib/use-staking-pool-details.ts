import { useMemo } from 'react';
import { useStakingPoolsStore } from '../model/staking-pools.store';

export function useStakingPoolDetails(name: string) {
  const { pools } = useStakingPoolsStore();

  return useMemo(() => {
    const transformedCurrentPoolName = name.split(' ')[0];
    return pools?.find((pool) =>
      pool.contractName.includes(transformedCurrentPoolName)
    );
  }, [name, pools]);
}
