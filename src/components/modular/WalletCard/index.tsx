import React, { useMemo } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { Row, Spacer, Spinner, Text } from '@components/base';
import { CopyToClipboardButton } from '@components/composite';
import { COLORS } from '@constants/colors';
import { StringUtils, NumberUtils, scale, verticalScale } from '@utils';
import { LogoGradient } from '@components/svg/icons';
import { ToastOptions, ToastPosition } from '../Toast';
import { TextProps } from '@components/base/Text/Text.types';

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

  const textProps: Partial<TextProps> = useMemo(
    () => ({
      fontSize: 15,
      fontWeight: '500',
      fontFamily: 'Inter_500Medium',
      color: addressTextColor
    }),
    [addressTextColor]
  );

  const iconProps = useMemo(
    () => ({
      color: addressTextColor
    }),
    [addressTextColor]
  );

  const successTextProps: Partial<TextProps> = useMemo(
    () => ({
      fontSize: 14,
      color: COLORS.neutral0
    }),
    []
  );

  const toastProps: Pick<ToastOptions, 'position'> = useMemo(
    () => ({
      position: ToastPosition.Top
    }),
    []
  );

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
        copiedTextWrapperStyle={styles.copiedTextWrapperStyle}
        textToCopy={address}
        textProps={textProps}
        iconProps={iconProps}
        successTextProps={successTextProps}
        toastProps={toastProps}
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
              {!Number.isNaN(usdBalance) && (
                <Text
                  fontSize={15}
                  fontFamily="Inter_500Medium"
                  color={priceTextColor}
                  style={styles.footerTypography}
                >
                  ${NumberUtils.numberToTransformedLocale(usdBalance)}
                </Text>
              )}

              {!!change24HR && (
                <>
                  <Spacer horizontal value={scale(12)} />
                  <Text
                    fontSize={15}
                    fontFamily="Inter_500Medium"
                    color={change24HR > 0 ? '#9FE1CC' : COLORS.error200}
                    style={styles.footerTypography}
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
