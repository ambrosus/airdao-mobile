import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { CryptoCurrencyCode } from '@appTypes';
import { HarborNavigationProp } from '@appTypes/navigation/harbor';
import { Row, Spacer, Text } from '@components/base';
import { TextOrSpinner } from '@components/composite';
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
  token?: CryptoCurrencyCode;
  apy?: number;
  stakeLockPeriod?: string;
  withdraw?: boolean;
  sender?: boolean;
}

const buttonNodeStyles = {
  active: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: COLORS.neutral0
  }
} as const;

export const SuccessTxView = ({
  amount,
  timestamp,
  txHash,
  sender = true,
  dismiss,
  token = CryptoCurrencyCode.HBR,
  apy,
  stakeLockPeriod,
  withdraw = false
}: SuccessTxViewProps) => {
  const { t } = useTranslation();
  const { wallet } = useWalletStore();
  const navigation = useNavigation<HarborNavigationProp>();
  const { hbrYieldFetcher } = useStakeHBRStore();
  const [loading, setLoading] = useState(false);

  const onDismissBottomSheet = useCallback(async () => {
    try {
      setLoading(true);
      await hbrYieldFetcher(wallet?.address ?? '');
      _delayNavigation(dismiss, () => navigation.goBack());
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, [dismiss, hbrYieldFetcher, navigation, wallet?.address]);

  const title = useMemo(() => {
    return t(
      withdraw ? 'Withdrawal request sent' : 'harbor.successfully.stake.header'
    );
  }, [t, withdraw]);

  return (
    <View style={styles.container}>
      <SuccessIcon />

      <View style={styles.header}>
        <Text
          fontSize={14}
          fontFamily="Inter_600SemiBold"
          color={COLORS.neutral900}
        >
          {title}
        </Text>

        <Row alignItems="center">
          <TokenLogo token={token} />
          <Spacer horizontal value={8} />
          <Text
            fontSize={24}
            fontFamily="Inter_700Bold"
            color={COLORS.neutral900}
          >
            {NumberUtils.numberToTransformedLocale(amount)} {token}
          </Text>
        </Row>
      </View>
      <View style={styles.details}>
        {/* Address row item */}
        {sender && (
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
        )}
        {apy && (
          <Row alignItems="center" justifyContent="space-between">
            <Text
              fontSize={14}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral600}
            >
              {t('staking.apy')}
            </Text>
            <Text
              fontSize={14}
              fontFamily="Inter_500Medium"
              color={COLORS.success300}
            >
              {apy}%
            </Text>
          </Row>
        )}
        {stakeLockPeriod && (
          <Row alignItems="center" justifyContent="space-between">
            <Text
              fontSize={14}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral600}
            >
              {t('kosmos.lock.period')}
            </Text>
            <Text
              fontSize={14}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral900}
            >
              {stakeLockPeriod} {t('common.days')}
            </Text>
          </Row>
        )}
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
      <PrimaryButton disabled={loading} onPress={onDismissBottomSheet}>
        <TextOrSpinner
          label={t('kosmos.button.close')}
          loading={loading}
          loadingLabel={undefined}
          styles={buttonNodeStyles}
          spinnerColor={COLORS.brand600}
        />
      </PrimaryButton>
    </View>
  );
};
