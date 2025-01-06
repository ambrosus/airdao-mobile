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
import { IAvailableWithdrawLogs, LogStatus } from '@entities/harbor/types';
import {
  calculateTextWidth,
  getWithdrawInputLabel
} from '@entities/harbor/utils';
import { useWalletStore } from '@entities/wallet';
import { useAMBEntity } from '@features/send-funds/lib/hooks';
import { NumberUtils, moderateScale } from '@utils';
import { styles } from './styles';

const BACKGROUND_CONTAINER_COLORS = {
  [LogStatus.SUCCESS]: 'rgba(22, 199, 132, 1)',
  [LogStatus.ERROR]: 'rgba(242, 180, 7, 1)'
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

  const disabled = useMemo(
    () => logs?.status === LogStatus.ERROR,
    [logs?.status]
  );

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

  const labelStatus = useMemo(
    () =>
      token === CryptoCurrencyCode.HBR
        ? LogStatus.WARNING
        : logs?.status ?? LogStatus.WARNING,
    [logs?.status, token]
  );

  // Dynamic Styles
  const containerStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      ...styles.container,
      backgroundColor: BACKGROUND_CONTAINER_COLORS[type]
    }),
    [type]
  );

  const lockIconStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      ...styles.lockIcon,
      right: calculateTextWidth(value, moderateScale(22)) + 4
    }),
    [value]
  );

  const typographyDynamicColor = useMemo(() => {
    return disabled ? 'rgba(88, 94, 119, 0.48)' : COLORS.neutral900;
  }, [disabled]);

  const renderInputLockNode = useMemo(() => {
    if (disabled && inputValueWidth > 0) {
      return (
        <View style={lockIconStyle}>
          <LockIcon color="rgba(88, 94, 119, 0.48)" />
        </View>
      );
    }
  }, [disabled, inputValueWidth, lockIconStyle]);

  return (
    <View style={containerStyle}>
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
        renderInputLockNode={renderInputLockNode}
      />

      <View style={styles.footer}>
        {getWithdrawInputLabel(labelStatus, logs?.timestamp)}
      </View>
    </View>
  );
};
