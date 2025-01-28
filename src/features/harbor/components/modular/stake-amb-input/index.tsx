import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { ethers } from 'ethers';
import { CryptoCurrencyCode } from '@appTypes';
import { InputWithoutTokenSelect } from '@components/templates';
import { useStakeHBRStore } from '@entities/harbor';
import { useStakeHBRActionsStore } from '@features/harbor/model';
import { Token } from '@models';
import { NumberUtils } from '@utils';
import { styles } from './styles';

function min(...args: any[]) {
  return args.reduce((acc, val) =>
    ethers.BigNumber.from(acc).lt(val) ? acc : val
  );
}

interface StakeAMBInputProps {
  tokenInstance: Token;
  error?: string;
}

export const StakeAMBInput = ({ error, tokenInstance }: StakeAMBInputProps) => {
  const { maxUserStakeValue, stake, totalPoolLimit, limitsConfig } =
    useStakeHBRStore();
  const { ambAmount, onChangeAMBAmountToStake } = useStakeHBRActionsStore();

  const exchange = useMemo(() => {
    return {
      token: CryptoCurrencyCode.AMB,
      value: maxUserStakeValue.sub(stake).isZero()
        ? '0.00'
        : NumberUtils.numberToTransformedLocale(
            +ethers.utils.formatEther(maxUserStakeValue.sub(stake))
          ),
      availableToStake: true
    };
  }, [maxUserStakeValue, stake]);

  const onPressMaxAmountHandle = useCallback(() => {
    const availableStake = ethers.BigNumber.from(maxUserStakeValue).sub(stake);
    const availableBalanceAMB = ethers.BigNumber.from(
      tokenInstance.balance.wei
    );
    const addressLimit = ethers.BigNumber.from(
      limitsConfig?.maxStakePerUserValue
    ).sub(stake);
    const poolLimit = ethers.BigNumber.from(
      limitsConfig?.maxTotalStakeValue
    ).sub(totalPoolLimit);

    if (!availableBalanceAMB.isZero()) {
      onChangeAMBAmountToStake(
        ethers.utils.formatEther(
          min(availableBalanceAMB, availableStake, addressLimit, poolLimit)
        )
      );
    }
  }, [
    stake,
    totalPoolLimit,
    maxUserStakeValue,
    onChangeAMBAmountToStake,
    limitsConfig?.maxStakePerUserValue,
    limitsConfig?.maxTotalStakeValue,
    tokenInstance.balance.wei
  ]);

  return (
    <View style={styles.container}>
      <InputWithoutTokenSelect
        inputError={error}
        value={ambAmount}
        onChangeText={onChangeAMBAmountToStake}
        token={tokenInstance}
        exchange={exchange}
        onPressMaxAmount={onPressMaxAmountHandle}
        arrow={false}
      />
    </View>
  );
};
