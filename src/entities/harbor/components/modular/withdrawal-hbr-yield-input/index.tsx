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
import { moderateScale } from '@utils';
import { styles } from './styles';

const BACKGROUND_CONTAINER_COLORS = {
  [LogStatus.SUCCESS]: 'rgba(22, 199, 132, 1)',
  [LogStatus.ERROR]: 'rgba(242, 180, 7, 1)'
} as const;

interface WithdrawalHbrYieldInputProps extends PropsWithChildren {
  value: string;
  onChangeValue: (payload: string) => void;
  token: CryptoCurrencyCode.AMB | CryptoCurrencyCode.HBR;
  type: LogStatus;
  logs: IAvailableWithdrawLogs | null;
}

export const WithdrawalHbrYieldInput = ({
  value,
  onChangeValue,
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
      backgroundColor:
        BACKGROUND_CONTAINER_COLORS[
          type as keyof typeof BACKGROUND_CONTAINER_COLORS
        ]
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

  const onPressMaxAmount = useCallback(() => {
    switch (token) {
      case CryptoCurrencyCode.AMB:
        return onChangeValue(ethers.utils.formatEther(stake));
      case CryptoCurrencyCode.HBR:
        return onChangeValue(ethers.utils.formatEther(deposit));
    }
  }, [deposit, onChangeValue, stake, token]);

  return (
    <View style={containerStyle}>
      <InputWithoutTokenSelect
        editable={!disabled}
        inputError={error}
        value={value}
        valueColor={typographyDynamicColor}
        onChangeText={onChangeValue}
        onContentSizeChange={onInputContentSizeChange}
        token={tokenInstance}
        balance={ethers.utils.formatEther(balance)}
        onPressMaxAmount={onPressMaxAmount}
        arrow={false}
        renderInputLockNode={renderInputLockNode}
        maxButtonLocked={logs?.status === LogStatus.ERROR}
      />

      <View style={styles.footer}>
        {getWithdrawInputLabel(labelStatus, logs?.timestamp)}
      </View>
    </View>
  );
};
