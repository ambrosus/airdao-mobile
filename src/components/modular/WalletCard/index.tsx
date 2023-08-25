import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import { CopyToClipboardButton } from '@components/composite';
import { COLORS } from '@constants/colors';
import { shadow } from '@constants/shadow';
import { NumberUtils } from '@utils/number';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { StringUtils } from '@utils/string';
import { LogoGradient } from '@components/svg/icons';

interface WalletCardProps {
  address: string;
  ambBalance: number;
  usdBalance: number;
  addressLeftPadding?: number;
  addressRightPadding?: number;
  backgroundColor?: string;
  addressTextColor?: string;
  priceTextColor?: string;
}
export const WalletCard = (props: WalletCardProps) => {
  const {
    address,
    ambBalance,
    usdBalance,
    addressLeftPadding = 5,
    addressRightPadding = 6,
    backgroundColor = COLORS.blue600,
    addressTextColor = COLORS.white50,
    priceTextColor = COLORS.white
  } = props;
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.logo}>
        <LogoGradient />
      </View>
      <CopyToClipboardButton
        textToDisplay={StringUtils.formatAddress(
          address,
          addressLeftPadding,
          addressRightPadding
        )}
        textToCopy={address}
        textProps={{
          fontFamily: 'Inter_400Regular',
          fontSize: 14,
          fontWeight: '400',
          color: addressTextColor
        }}
        iconProps={{
          color: addressTextColor
        }}
      />
      <View>
        <Row alignItems="center">
          <Text
            color={priceTextColor}
            fontSize={24}
            fontWeight="800"
            fontFamily="Mersad_600SemiBold"
          >
            {NumberUtils.formatNumber(ambBalance, ambBalance > 0 ? 2 : 0)} AMB
          </Text>
          <Spacer value={scale(16)} horizontal />
          <Text
            color={priceTextColor}
            fontSize={14}
            fontWeight="500"
            fontFamily="Inter_500Medium"
          >
            ${NumberUtils.formatNumber(usdBalance, usdBalance > 0 ? 2 : 0)}
          </Text>
        </Row>
        <Spacer value={verticalScale(12)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.blue600,
    borderRadius: moderateScale(16),
    minHeight: 148,
    height: verticalScale(148),
    overflow: 'hidden',
    paddingLeft: scale(20),
    paddingVertical: verticalScale(22),
    justifyContent: 'space-between',
    ...shadow
  },
  logo: {
    position: 'absolute',
    top: -verticalScale(16),
    right: -scale(16)
  }
});
