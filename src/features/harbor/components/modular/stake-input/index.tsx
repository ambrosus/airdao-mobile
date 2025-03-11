import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { ethers } from 'ethers';
import { CryptoCurrencyCode } from '@appTypes';
import { Spacer, Text } from '@components/base';
import { InputWithoutTokenSelect } from '@components/templates';
import { useHBRInstance, useStakeHBRStore } from '@entities/harbor';
import { useStakeHBRActionsStore } from '@features/harbor/model';
import { NumberUtils, verticalScale } from '@utils';
import { styles } from './styles';

interface StakeInputProps {
  description?: string;
  readonly error?: string;
}

export const StakeInput = ({ description, error }: StakeInputProps) => {
  const hbrInstance = useHBRInstance();
  const { maxUserStakeValue, stake } = useStakeHBRStore();
  const { amount, onChangeHBRAmountToStake } = useStakeHBRActionsStore();

  const onPressMaxAmountHandle = useCallback(
    () =>
      onChangeHBRAmountToStake(
        ethers.utils.formatEther(hbrInstance.balance.wei)
      ),
    [hbrInstance.balance.wei, onChangeHBRAmountToStake]
  );

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

  return (
    <View style={styles.container}>
      <InputWithoutTokenSelect
        inputError={error}
        value={amount}
        onChangeText={onChangeHBRAmountToStake}
        token={hbrInstance}
        exchange={exchange}
        onPressMaxAmount={onPressMaxAmountHandle}
      />

      <Spacer value={verticalScale(8)} />
      <Text
        fontSize={12}
        fontFamily="Inter_500Medium"
        color="rgba(88, 94, 119, 1)"
        align="left"
        style={styles.description}
      >
        {description}
      </Text>
    </View>
  );
};
