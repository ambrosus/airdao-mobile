import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import moment from 'moment/moment';
import { Row, Spacer, Text } from '@components/base';
import { SuccessIcon } from '@components/svg/icons/v2/harbor';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { PrimaryButton, TokenLogo } from '@components/modular';
import { PreviewDataModel } from '@features/harbor/components/templates/harbor-preview/models';
import { NumberUtils } from '@utils/number';
import { styles } from './styles';
import { StringUtils } from '@utils/string';
import { ContentItem, CopyHash } from './components';
import { useTransactionDetails } from '@hooks';
import { Transaction } from '@models';
import { TokenUtils } from '@utils/token';

interface PreviewSuccessModel {
  onClose: () => void;
  previewData: PreviewDataModel;
  transaction: Transaction | { transactionHash: string };
}

export const PreviewSuccess = ({
  previewData,
  onClose,
  transaction
}: PreviewSuccessModel) => {
  const { apy, receiveToken, receiveAmount, fromAddress } = previewData;
  const { data: transactionDetails } = useTransactionDetails(
    // @ts-ignore
    transaction?.transactionHash || ''
  );

  const stakeTransaction = useMemo(() => {
    if (transactionDetails) {
      // @ts-ignore
      return new Transaction(transactionDetails, TokenUtils);
    }
    return null;
  }, [transactionDetails]);

  const date = moment(stakeTransaction?.timestamp).format('DD/MM/YYYY  HH:mm');

  const { t } = useTranslation();

  return (
    <View style={{ alignItems: 'center' }}>
      <Row justifyContent="center">
        <SuccessIcon />
      </Row>
      <Spacer value={scale(8)} />
      <Text fontSize={14} color={COLORS.neutral900}>
        {t('harbor.successfully.stake.header')}
      </Text>
      <Spacer value={scale(12)} />
      <Row alignItems="center">
        <TokenLogo token={'amb'} />
        <Spacer horizontal value={scale(8)} />
        <Text
          fontFamily="Inter_500Medium"
          fontSize={24}
          color={COLORS.neutral900}
        >
          {NumberUtils.limitDecimalCount(receiveAmount, 2)} {receiveToken}
        </Text>
      </Row>
      <Spacer value={scale(12)} />
      <View style={styles.contentWrapper}>
        <ContentItem
          title={t('common.transaction.from')}
          value={StringUtils.formatAddress(fromAddress, 10, 3)}
        />
        <Spacer value={scale(8)} />
        <ContentItem title={t('staking.apy')} value={`${apy} %`} isApy />
        <Spacer value={scale(8)} />
        {stakeTransaction?.timestamp && (
          <ContentItem title={t('common.date')} value={date} />
        )}
      </View>
      <Spacer value={scale(12)} />
      {stakeTransaction?.hash && (
        <CopyHash hash={stakeTransaction.hash || ''} />
      )}
      <Spacer value={scale(12)} />
      <PrimaryButton onPress={onClose}>
        <Text color={COLORS.neutral0}>{t('kosmos.button.close')}</Text>
      </PrimaryButton>
    </View>
  );
};
