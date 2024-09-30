import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Row, Spacer, Spinner, Text } from '@components/base';
import { CopyToClipboardButton } from '@components/composite';
import { COLORS } from '@constants/colors';
import { NumberUtils } from '@utils/number';
import { scale, verticalScale } from '@utils/scaling';
import { StringUtils } from '@utils/string';
import { LogoGradient } from '@components/svg/icons';
import { ToastPosition } from '../Toast';
import { styles } from './styles';

export interface WalletCardProps {
  address: string;
  ambBalance: string;
  usdBalance: number;
  addressLeftPadding?: number;
  addressRightPadding?: number;
  backgroundColor?: string;
  addressTextColor?: string;
  priceTextColor?: string;
  balanceLoading?: boolean;
  change24HR?: number;
}

const LOGO_THEME = {
  DARK: [COLORS.neutral700]
};

const LOGO_GRADIENT = {
  DARK: [COLORS.neutral900, COLORS.neutral900],
  LIGHT: [COLORS.brand600, COLORS.brand300]
};
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
    change24HR = 0
  } = props;

  const { t } = useTranslation();

  const isDarkTheme = LOGO_THEME.DARK.includes(backgroundColor);

  const logoGradient = isDarkTheme ? LOGO_GRADIENT.DARK : LOGO_GRADIENT.LIGHT;

  const percentChange = NumberUtils.addSignToNumber(change24HR);
  const fiatChange = NumberUtils.formatNumber(
    (usdBalance * change24HR) / 100,
    2
  );
  const timeChange = t('common.today').toLowerCase();

  const changeInfo = `${percentChange}% ($${fiatChange}) ${timeChange}`;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.logo}>
        <LogoGradient logoGradient={logoGradient} />
      </View>
      <CopyToClipboardButton
        textToDisplay={StringUtils.formatAddress(
          address,
          addressLeftPadding,
          addressRightPadding
        )}
        copiedTextWrapperStyle={{
          backgroundColor: COLORS.lightWhite,
          borderColor: COLORS.transparentWhite,
          borderWidth: 1,
          paddingHorizontal: 8,
          borderRadius: 20
        }}
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
                {NumberUtils.limitDecimalCount(ambBalance, 2)} AMB
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
                  {NumberUtils.limitDecimalCount(
                    usdBalance,
                    usdBalance > 0 ? 2 : 0
                  )}
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
                {changeInfo}
              </Text>
            )}
          </>
        )}
      </View>
    </View>
  );
};
