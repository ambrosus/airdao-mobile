import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { CryptoCurrencyCode } from '@appTypes';
import { HarborNavigationProp } from '@appTypes/navigation/harbor';
import { Row, Spacer, Text } from '@components/base';
import { PrimaryButton, TokenLogo } from '@components/modular';
import { SuccessIcon } from '@components/svg/icons/v2/harbor';
import { COLORS } from '@constants/colors';
import { useStakeHBRStore } from '@entities/harbor/model';
import { useWalletStore } from '@entities/wallet';
import { CopyHash } from '@features/harbor/components/base/preview-modules/success-template/copy-hash';
import { NumberUtils, StringUtils, _delayNavigation, scale } from '@utils';
import { styles } from './styles';

interface SuccessTxViewProps {
  readonly amount: string;
  timestamp?: unknown;
  txHash?: string;
  dismiss: () => void;
}

export const SuccessTxView = ({
  amount,
  timestamp,
  txHash,
  dismiss
}: SuccessTxViewProps) => {
  const { t } = useTranslation();
  const { wallet } = useWalletStore();
  const navigation = useNavigation<HarborNavigationProp>();
  const { hbrYieldFetcher } = useStakeHBRStore();

  const onDismissBottomSheet = useCallback(async () => {
    try {
      await hbrYieldFetcher(wallet?.address ?? '');
      _delayNavigation(dismiss, () => navigation.goBack());
    } catch (error) {
      throw error;
    }
  }, [dismiss, hbrYieldFetcher, navigation, wallet?.address]);

  return (
    <View style={styles.container}>
      <SuccessIcon />

      <View style={styles.header}>
        <Text
          fontSize={14}
          fontFamily="Inter_600SemiBold"
          color={COLORS.neutral900}
        >
          {t('harbor.successfully.stake.header')}
        </Text>

        <Row alignItems="center">
          <TokenLogo token={CryptoCurrencyCode.HBR} />
          <Spacer horizontal value={8} />
          <Text
            fontSize={24}
            fontFamily="Inter_700Bold"
            color={COLORS.neutral900}
          >
            {NumberUtils.numberToTransformedLocale(amount)}{' '}
            {CryptoCurrencyCode.HBR}
          </Text>
        </Row>
      </View>
      <View style={styles.details}>
        {/* Address row item */}
        <Row alignItems="center" justifyContent="space-between">
          <Text
            fontSize={14}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral600}
          >
            {t('common.transaction.from')}
          </Text>
          <Text
            fontSize={14}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral900}
          >
            {StringUtils.formatAddress(wallet?.address ?? '', 10, 3)}
          </Text>
        </Row>
        {/* Date row item */}
        <Row alignItems="center" justifyContent="space-between">
          <Text
            fontSize={14}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral600}
          >
            {t('common.date')}
          </Text>
          <Text
            fontSize={14}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral900}
          >
            {timestamp
              ? moment(+timestamp * 1000).format('DD/MM/YYYY HH:mm')
              : ''}
          </Text>
        </Row>
      </View>
      <Spacer value={scale(12)} />
      {!!txHash && (
        <View style={styles.txHashContainer}>
          <CopyHash hash={txHash} bgColor="transparent" />
        </View>
      )}
      <Spacer value={scale(12)} />
      <PrimaryButton onPress={onDismissBottomSheet}>
        <Text
          fontSize={14}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral0}
        >
          Close
        </Text>
      </PrimaryButton>
    </View>
  );
};
