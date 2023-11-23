import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Row, Spacer, Spinner, Text } from '@components/base';
import { CopyToClipboardButton } from '@components/composite';
import { COLORS } from '@constants/colors';
import { shadow } from '@constants/shadow';
import { NumberUtils } from '@utils/number';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { StringUtils } from '@utils/string';
import { LogoGradient } from '@components/svg/icons';
import { ToastPosition } from '../Toast';

export const WalletCardHeight = 172;
export interface WalletCardProps {
  address: string;
  ambBalance: number;
  usdBalance: number;
  addressLeftPadding?: number;
  addressRightPadding?: number;
  backgroundColor?: string;
  addressTextColor?: string;
  priceTextColor?: string;
  balanceLoading?: boolean;
  change24HR?: number;
}
export const WalletCard = (props: WalletCardProps) => {
  const {
    address,
    ambBalance,
    usdBalance,
    addressLeftPadding = 5,
    addressRightPadding = 6,
    backgroundColor = COLORS.brand600,
    addressTextColor = COLORS.alphaWhite50,
    priceTextColor = COLORS.neutral0,
    balanceLoading = false,
    change24HR
  } = props;

  const { t } = useTranslation();
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
        successTextProps={{ color: COLORS.neutral0, fontSize: 14 }}
        toastProps={{ position: ToastPosition.Top }}
      />
      <View>
        {balanceLoading ? (
          <Spinner />
        ) : (
          <>
            <Row alignItems="center">
              <Text
                color={priceTextColor}
                fontSize={24}
                fontWeight="800"
                fontFamily="Mersad_600SemiBold"
              >
                {StringUtils.limitNumberInputDecimals(ambBalance.toString(), 2)}{' '}
                AMB
              </Text>
              <Spacer value={scale(16)} horizontal />
              <View style={styles.usdPriceBg}>
                <Text
                  color={priceTextColor}
                  fontSize={14}
                  fontWeight="500"
                  fontFamily="Inter_500Medium"
                >
                  $
                  {NumberUtils.formatNumber(usdBalance, usdBalance > 0 ? 2 : 0)}
                </Text>
              </View>
            </Row>
            <Spacer value={verticalScale(10)} />
            {change24HR != undefined && (
              <Text
                fontSize={14}
                fontFamily="Inter_500Medium"
                color={priceTextColor}
              >
                {NumberUtils.addSignToNumber(change24HR)}%{' '}
                {t('common.today').toLowerCase()}
              </Text>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: moderateScale(16),
    // minHeight: 148,
    width: scale(300),
    height: verticalScale(172),
    minHeight: WalletCardHeight,
    overflow: 'hidden',
    paddingLeft: scale(20),
    paddingVertical: verticalScale(24),
    justifyContent: 'space-between',
    ...shadow
  },
  logo: {
    position: 'absolute',
    top: -verticalScale(16),
    right: -scale(16)
  },
  usdPriceBg: {
    justifyContent: 'center',
    minHeight: verticalScale(20),
    borderRadius: 1000,
    backgroundColor: COLORS.alphaWhite5,
    paddingHorizontal: scale(8)
  }
});
