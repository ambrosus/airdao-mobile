import { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { HBR_POOL } from '@api/harbor';
import Config from '@constants/config';
import { IAvailableWithdrawLogs, LogStatus } from '@entities/harbor/types';
import { useWalletStore } from '@entities/wallet';

const provider = new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);

export function useAvailableWithdrawLogs(lockPeriod: ethers.BigNumber) {
  const { wallet } = useWalletStore();
  const [logs, setLogs] = useState<IAvailableWithdrawLogs | null>(null);
  const stakeLockPeriod = Number(lockPeriod);

  const fetchLogs = useCallback(async () => {
    const contract = new ethers.Contract(
      Config.HBR_LIQUIDITY_POOL,
      HBR_POOL,
      provider
    );

    const rawWithdrawalsList = await contract.queryFilter(
      contract.filters.Staked(wallet?.address ?? ''),
      0,
      'latest'
    );

    const withdrawalsList: IAvailableWithdrawLogs[] = [];

    for (let i = 0; i < rawWithdrawalsList.length; i++) {
      const currEvent: any = rawWithdrawalsList[i];
      const unlockDateTime = new Date(Number(currEvent.args.timestamp) * 1000);
      const unlockTimestamp = unlockDateTime.getTime();
      const unlockStakeLockPeriod = stakeLockPeriod * 1000;
      const currentTimestamp = new Date().getTime();
      const unlockTimeWithPeriod = unlockTimestamp + unlockStakeLockPeriod;
      const isUnlockPeriodComplete = unlockTimeWithPeriod < currentTimestamp;

      const formattedUnlockDateTime = new Date(
        unlockTimeWithPeriod
      ).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const unlockStatus = isUnlockPeriodComplete
        ? {
            text: 'Lock period complete',
            status: 'success' as LogStatus.SUCCESS,
            timestamp: unlockTimeWithPeriod
          }
        : {
            text: `Available on ${formattedUnlockDateTime}`,
            status: 'error' as LogStatus.ERROR,
            timestamp: unlockTimeWithPeriod
          };

      withdrawalsList.unshift(unlockStatus);
    }

    if (withdrawalsList.length > 0) {
      setLogs(withdrawalsList[0]);
    }
  }, [stakeLockPeriod, wallet?.address]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, refetchLogs: fetchLogs };
}
