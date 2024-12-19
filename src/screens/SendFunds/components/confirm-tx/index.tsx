import React, { PropsWithChildren, useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeNavigationProp } from '@appTypes';
import { Row, Spacer, Spinner, Text } from '@components/base';
import {
  BottomSheetErrorView,
  BottomSheetSuccessView
} from '@components/base/BottomSheetStatusView';
import { PrimaryButton, SecondaryButton, TokenLogo } from '@components/modular';
import { AddressRowWithAction } from '@components/templates/ExplorerAccount/components';
import { COLORS } from '@constants/colors';
import { useSendFundsStore } from '@features/send-funds';
import {
  cssShadowToNative,
  verticalScale,
  NumberUtils,
  _delayNavigation
} from '@utils';
import { styles } from './styles';

interface ConfirmTransactionProps {
  from: string;
  to: string;
  etherAmount: number;
  currency: string;
  estimatedFee: number;
  onSendPress: () => unknown;
  onSuccessBottomSheetDismiss: () => void;
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
  onSuccessBottomSheetDismiss,
  dismissBottomSheet
}: ConfirmTransactionProps) => {
  const navigation: HomeNavigationProp = useNavigation();
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();

  const {
    state: { loading, error, success },
    onChangeState
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

  const shadow = useMemo(
    () => cssShadowToNative('0px 0px 12px 0px rgba(53, 104, 221, 0.50)'),
    []
  );

  if (success) {
    const description = `You sent ${NumberUtils.numberToTransformedLocale(
      etherAmount
    )} ${currency}`;

    return (
      <BottomSheetSuccessView
        description={description}
        onButtonPress={onSuccessBottomSheetDismiss}
      />
    );
  }

  if (!!error) {
    const onTryAgainButtonPress = () => {
      onChangeState({ error: null });
      dismissBottomSheet();
    };

    const onDoneButtonPress = () =>
      _delayNavigation(dismissBottomSheet, () =>
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'HomeScreen' }]
          })
        )
      );

    return (
      <BottomSheetErrorView title={t('send.funds.failed')}>
        <View style={styles.errorFooter}>
          <Text
            fontSize={17}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral500}
            style={styles.description}
            align="center"
          >
            {t('bridge.transfer.failed.sub.header')}
          </Text>
          <PrimaryButton onPress={onTryAgainButtonPress} style={shadow}>
            <Text
              fontFamily="Inter_600SemiBold"
              fontSize={16}
              color={COLORS.neutral0}
            >
              {t('button.try.again')}
            </Text>
          </PrimaryButton>

          <SecondaryButton
            onPress={onDoneButtonPress}
            style={styles.secondaryButton}
          >
            <Text
              fontFamily="Inter_600SemiBold"
              fontSize={16}
              color={COLORS.brand500}
            >
              {t('common.done')}
            </Text>
          </SecondaryButton>
        </View>
      </BottomSheetErrorView>
    );
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
