import React, { useMemo } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { Row, Spacer, Spinner, Text } from '@components/base';
import { CopyToClipboardButton } from '@components/composite';
import { COLORS } from '@constants/colors';
import { NumberUtils } from '@utils/number';
import { scale, verticalScale } from '@utils/scaling';
import { StringUtils } from '@utils/string';
import { LogoGradient } from '@components/svg/icons';
import { ToastPosition } from '../Toast';

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
  GREEN: [COLORS.green500],
  PURPLE: [COLORS.purple500],
  BLUE: [COLORS.brand600]
};

const LOGO_GRADIENT = {
  GREEN: ['rgba(255, 238, 80, 1)', 'rgba(108, 225, 169, 1)'],
  PURPLE: ['rgba(241, 80, 255, 1)', 'rgba(146, 108, 255, 1)'],
  BLUE: ['rgba(80, 255, 255, 1)', 'rgba(108, 157, 255, 1)']
};

export const WalletCard = ({
  address,
  ambBalance,
  usdBalance,
  addressLeftPadding = 5,
  addressRightPadding = 6,
  backgroundColor = COLORS.brand600,
  addressTextColor = COLORS.alphaWhite80,
  priceTextColor = COLORS.neutral0,
  balanceLoading = false,
  change24HR = 0
}: WalletCardProps) => {
  const logoGradient = useMemo((): string[] => {
    if (LOGO_THEME.GREEN.includes(backgroundColor)) {
      return LOGO_GRADIENT.GREEN;
    } else if (LOGO_THEME.PURPLE.includes(backgroundColor)) {
      return LOGO_GRADIENT.PURPLE;
    } else if (LOGO_THEME.BLUE.includes(backgroundColor)) {
      return LOGO_GRADIENT.BLUE;
    }

    return [];
  }, [backgroundColor]);

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
          fontSize: 15,
          fontWeight: '500',
          fontFamily: 'Inter_500Medium',
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
                fontSize={22}
                fontFamily="Inter_700Bold"
                color={COLORS.neutral0}
                numberOfLines={1}
              >
                {NumberUtils.numberToTransformedLocale(ambBalance)} AMB
              </Text>
              <Spacer value={scale(16)} horizontal />
            </Row>
            <Spacer value={verticalScale(10)} />
            <Row alignItems="center">
              <Text
                fontSize={14}
                fontFamily="Inter_500Medium"
                color={priceTextColor}
              >
                ${NumberUtils.numberToTransformedLocale(usdBalance)}
              </Text>

              {change24HR != undefined && (
                <>
                  <Spacer horizontal value={scale(12)} />
                  <Text
                    fontSize={14}
                    fontFamily="Inter_500Medium"
                    color={change24HR > 0 ? '#9FE1CC' : COLORS.error200}
                  >
                    {`${NumberUtils.addSignToNumber(
                      +NumberUtils.formatNumber(change24HR, 2)
                    )}%`}
                  </Text>
                </>
              )}
            </Row>
          </>
        )}
      </View>
    </View>
  );
};
