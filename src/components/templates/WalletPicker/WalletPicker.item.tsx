import React from 'react';
import { View } from 'react-native';
import { CryptoCurrencyCode } from '@appTypes';
import { Row, Spacer, Text } from '@components/base';
import { CheckIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { AccountDBModel } from '@database';
import { useBalanceOfAddress, useUSDPrice } from '@hooks';
import { NumberUtils, StringUtils, scale, verticalScale } from '@utils';
import { styles } from './styles';
import { WalletAvatars } from './WalletPicker.constants';

interface WalletItemProps {
  wallet: AccountDBModel;
  index: number;
  selected: boolean;
}

export const WalletPickerItem = (props: WalletItemProps) => {
  const { wallet, index, selected } = props;
  const { data: ambBalance } = useBalanceOfAddress(wallet.address);
  const usdBalance = useUSDPrice(
    parseFloat(ambBalance?.ether || '0'),
    CryptoCurrencyCode.AMB
  );

  return (
    <Row alignItems="center">
      <View style={styles.circularAvatar}>{WalletAvatars[index]}</View>
      <Spacer value={scale(16)} horizontal />
      <View style={{ flex: 1 }}>
        <Text
          fontSize={16}
          fontFamily="Inter_500Medium"
          fontWeight="500"
          color={COLORS.neutral500}
        >
          {StringUtils.formatAddress(wallet.address, 5, 6)}
        </Text>
        <Spacer value={verticalScale(8)} />
        <Row alignItems="center">
          <Text
            color={COLORS.neutral600}
            fontSize={14}
            fontFamily="Inter_600SemiBold"
            fontWeight="600"
          >
            {StringUtils.formatNumberInput(
              NumberUtils.limitDecimalCount(ambBalance?.ether || 0, 2)
            )}{' '}
            AMB
          </Text>
          <Spacer value={scale(8)} horizontal />
          {!Number.isNaN(usdBalance) && (
            <Text
              fontSize={14}
              fontFamily="Inter_500Medium"
              fontWeight="500"
              color={COLORS.neutral400}
            >
              ${NumberUtils.limitDecimalCount(usdBalance, 2)}
            </Text>
          )}
        </Row>
      </View>
      <Spacer value={scale(16)} horizontal />
      {selected && (
        <View style={styles.checkmark}>
          <CheckIcon color={COLORS.neutral0} scale={0.985} />
        </View>
      )}
    </Row>
  );
};
