import { useMemo } from 'react';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { CryptoCurrencyCode } from '@appTypes';
import { useStakeHBRStore } from '@entities/harbor/model';
import { useStakeHBRActionsStore } from '@features/harbor/model';
import { Token } from '@models';
import { NumberUtils } from '@utils';

export function useInputErrorStakeAMB(ambInstance: Token) {
  const { t } = useTranslation();
  const { deposit, stake, limitsConfig, maxUserStakeValue, totalPoolLimit } =
    useStakeHBRStore();

  const { minStakeValue, maxTotalStakeValue, maxStakePerUserValue } =
    limitsConfig;

  const { ambAmount } = useStakeHBRActionsStore();
  const {
    balance: { wei: ambBalance }
  } = ambInstance;

  const inputError = useMemo(() => {
    let inputError: string | undefined;

    if (ambAmount === '') return;

    if (deposit.isZero()) {
      inputError = 'Insufficient HBR balance';
    }

    if (ethers.utils.parseEther(ambAmount).lt(minStakeValue)) {
      inputError =
        inputError ??
        `Min ${NumberUtils.formatNumber(
          +ethers.utils.formatEther(minStakeValue)
        )} ${CryptoCurrencyCode.AMB}`;
    }

    if (ethers.utils.parseEther(ambAmount).gt(ambBalance)) {
      inputError = inputError ?? t('bridge.insufficient.funds');
    }

    if (ethers.utils.parseEther(ambAmount).gt(maxUserStakeValue)) {
      inputError = inputError ?? t('harbor.button.insufficient.stake');
    }

    if (
      ethers.utils.parseEther(ambAmount).gt(maxStakePerUserValue.sub(stake))
    ) {
      inputError = inputError ?? t('harbor.button.hbr.insufficient');
    }

    if (
      ethers.utils
        .parseEther(ambAmount)
        .gt(maxTotalStakeValue.sub(totalPoolLimit))
    ) {
      inputError = inputError ?? t('harbor.button.total.limit');
    }

    return inputError;
  }, [
    ambAmount,
    deposit,
    minStakeValue,
    ambBalance,
    maxUserStakeValue,
    maxStakePerUserValue,
    stake,
    maxTotalStakeValue,
    totalPoolLimit,
    t
  ]);

  return inputError;
}

export const useInputErrorStakeHBR = (hbrInstance: Token) => {
  const { t } = useTranslation();
  const { limitsConfig } = useStakeHBRStore();
  const { amount } = useStakeHBRActionsStore();
  const { minStakeValue } = limitsConfig;

  const {
    balance: { wei: hbrBalance }
  } = hbrInstance;

  return useMemo(() => {
    let inputError: string | undefined;

    if (amount === '') return;

    if (ethers.utils.parseEther(amount).gt(hbrBalance)) {
      inputError = inputError ?? t('bridge.insufficient.funds');
    }

    if (ethers.utils.parseEther(amount).lt(minStakeValue)) {
      inputError =
        inputError ??
        `Min ${NumberUtils.formatNumber(
          +ethers.utils.formatEther(minStakeValue)
        )} ${CryptoCurrencyCode.HBR}`;
    }

    return inputError;
  }, [amount, hbrBalance, minStakeValue, t]);
};
