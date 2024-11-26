import React, { PropsWithChildren, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';
import { Row, Spacer, Spinner, Text } from '@components/base';
import { PrimaryButton, TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';
import { verticalScale } from '@utils/scaling';
import { AddressRowWithAction } from '@components/templates/ExplorerAccount/components';
import { NumberUtils } from '@utils/number';
import { cssShadowToNative } from '@utils/css-shadow-to-native';
import {
  BottomSheetErrorView,
  BottomSheetSuccessView
} from '@components/base/BottomSheetStatusView';
import { useSendFundsStore } from '@features/send-funds';

interface ConfirmTransactionProps {
  from: string;
  to: string;
  etherAmount: number;
  currency: string;
  estimatedFee: number;
  onSendPress: () => unknown;
  dismissBottomSheet: () => void;
}

const Title = (props: PropsWithChildren) => {
  return (
    <Text fontSize={15} fontFamily="Inter_500Medium" color={COLORS.neutral500}>
      {props.children}
    </Text>
  );
};

export const ConfirmTransaction = ({
  from,
  to,
  etherAmount,
  currency,
  estimatedFee,
  onSendPress,

  dismissBottomSheet
}: ConfirmTransactionProps) => {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();

  const {
    state: { loading, error, success }
  } = useSendFundsStore();

  const containerStyle = useMemo(
    () => [styles.container, { paddingBottom: bottom }],
    [bottom]
  );

  const buttonColors = useMemo(() => {
    return loading
      ? [COLORS.primary50, COLORS.primary50]
      : [COLORS.brand600, COLORS.brand600];
  }, [loading]);

  const buttonShadow: StyleProp<ViewStyle> = useMemo(() => {
    if (loading) return { shadowOpacity: 0 };

    return cssShadowToNative('0px 0px 12px 0px rgba(53, 104, 221, 0.50)');
  }, [loading]);

  if (success) {
    const description = `You sent ${NumberUtils.numberToTransformedLocale(
      etherAmount
    )} ${currency}`;

    return (
      <BottomSheetSuccessView
        description={description}
        onButtonPress={dismissBottomSheet}
      />
    );
  }

  if (!!error) {
    return <BottomSheetErrorView />;
  }

  return (
    <View style={containerStyle}>
      <Spacer value={verticalScale(24)} />
      <View style={styles.innerContainer}>
        {/* Amount details section */}
        <Row alignItems="center" justifyContent="space-between">
          <Title>{t('common.transactions.sending')}</Title>
          <Row alignItems="center" style={styles.amountContainerRow}>
            <TokenLogo token={currency} scale={0.75} />
            <Text
              fontSize={15}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral800}
            >
              {NumberUtils.numberToTransformedLocale(etherAmount)} {currency}
            </Text>
          </Row>
        </Row>

        {/* Inner details section */}
        <AddressRowWithAction
          label={t('common.transaction.from')}
          address={from}
        />

        <AddressRowWithAction
          label={t('common.transaction.destination')}
          address={to}
        />

        <Row alignItems="center" justifyContent="space-between">
          <Title>{t('swap.bottom.sheet.lpfee')}</Title>
          <Text
            fontSize={15}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral800}
          >
            {estimatedFee} AMB
          </Text>
        </Row>

        <PrimaryButton
          style={buttonShadow}
          colors={buttonColors}
          onPress={onSendPress}
          disabled={loading}
        >
          {loading ? (
            <Row alignItems="center" style={styles.pendingLayout}>
              <Spinner size="xs" />
              <Text
                fontSize={16}
                fontFamily="Inter_600SemiBold"
                color={COLORS.brand600}
              >
                {t('button.sending')}
              </Text>
            </Row>
          ) : (
            <Text color={COLORS.neutral0} fontSize={16}>
              {t('button.confirm')}
            </Text>
          )}
        </PrimaryButton>
      </View>
    </View>
  );
};
