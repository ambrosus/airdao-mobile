import React, {
  PropsWithChildren,
  useCallback,
  useMemo,
  useState
} from 'react';
import {
  NativeSyntheticEvent,
  StyleProp,
  TextInputContentSizeChangeEventData,
  View,
  ViewStyle
} from 'react-native';
import { ethers } from 'ethers';
import { CryptoCurrencyCode } from '@appTypes';
import { LockIcon } from '@components/svg/icons/v2/harbor';
import { InputWithoutTokenSelect } from '@components/templates';
import { COLORS } from '@constants/colors';
import { useHBRInstance } from '@entities/harbor/lib/hooks';
import { useStakeHBRStore } from '@entities/harbor/model';
import { IAvailableWithdrawLogs } from '@entities/harbor/types';
import {
  calculateTextWidth,
  getWithdrawInputLabel
} from '@entities/harbor/utils';
import { useWalletStore } from '@entities/wallet';
import { useAMBEntity } from '@features/send-funds/lib/hooks';
import { NumberUtils, moderateScale } from '@utils';
import { styles } from './styles';

const BACKGROUND_CONTAINER_COLORS = {
  success: 'rgba(22, 199, 132, 1)',
  error: 'rgba(242, 180, 7, 1)'
} as const;

interface WithdrawalHbrYieldInputProps extends PropsWithChildren {
  token: CryptoCurrencyCode.AMB | CryptoCurrencyCode.HBR;
  type: keyof typeof BACKGROUND_CONTAINER_COLORS;
  logs: IAvailableWithdrawLogs | null;
}

export const WithdrawalHbrYieldInput = ({
  token,
  type,
  logs
}: WithdrawalHbrYieldInputProps) => {
  const { wallet } = useWalletStore();
  const { stake, deposit } = useStakeHBRStore();

  const [inputValueWidth, setInputValueWidth] = useState(0);

  const [error] = useState('');
  const ambInstance = useAMBEntity(wallet?.address ?? '');
  const hbrInstance = useHBRInstance();

  const onInputContentSizeChange = useCallback(
    (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
      setInputValueWidth(event.nativeEvent.contentSize.width);
    },
    []
  );

  const onChangeAMBAmountToWithdraw = useCallback((amount: string) => {
    console.warn(amount);
  }, []);

  const disabled = useMemo(() => logs?.status === 'error', [logs?.status]);

  const typographyDynamicColor = useMemo(() => {
    return disabled ? 'rgba(88, 94, 119, 0.48)' : COLORS.neutral900;
  }, [disabled]);

  const tokenInstance = useMemo(
    () => (token === CryptoCurrencyCode.AMB ? ambInstance : hbrInstance),
    [ambInstance, hbrInstance, token]
  );

  const balance = useMemo(
    () => (token === CryptoCurrencyCode.AMB ? stake : deposit),
    [deposit, stake, token]
  );

  const value = useMemo(
    () => NumberUtils.limitDecimalCount(ethers.utils.formatEther(balance), 3),
    [balance]
  );

  const lockIconStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      ...styles.lockIcon,
      right: calculateTextWidth(value, moderateScale(22)) + 4
    }),
    [value]
  );

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: BACKGROUND_CONTAINER_COLORS[type]
      }}
    >
      <InputWithoutTokenSelect
        editable={!disabled}
        inputError={error}
        value={value}
        valueColor={typographyDynamicColor}
        onChangeText={onChangeAMBAmountToWithdraw}
        onContentSizeChange={onInputContentSizeChange}
        token={tokenInstance}
        balance={ethers.utils.formatEther(balance)}
        onPressMaxAmount={() => null}
        arrow={false}
        renderInputLockNode={
          disabled &&
          inputValueWidth > 0 && (
            <View style={lockIconStyle}>
              <LockIcon color="rgba(88, 94, 119, 0.48)" />
            </View>
          )
        }
      />

      <View style={styles.footer}>
        {getWithdrawInputLabel(logs?.status ?? 'warning', logs?.timestamp)}
      </View>
    </View>
  );
};
