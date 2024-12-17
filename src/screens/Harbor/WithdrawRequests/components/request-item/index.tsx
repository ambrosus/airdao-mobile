import React from 'react';
import { View } from 'react-native';
import { styles } from '@screens/Harbor/WithdrawRequests/WithdrawRequests.style';
import { Row, Spacer, Text } from '@components/base';
import { TokenLogo } from '@components/modular';
import { CryptoCurrencyCode } from '@appTypes';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { NumberUtils } from '@utils/number';
import { formatEther } from 'ethers/lib/utils';
import { useTranslation } from 'react-i18next';
import { ILogs } from '@entities/harbor/model/types';

export const RequestItem = ({ requestItem }: { requestItem: ILogs }) => {
  const { t } = useTranslation();
  const amount = NumberUtils.numberToTransformedLocale(
    NumberUtils.limitDecimalCount(+formatEther(requestItem.amount), 2)
  );

  const isSuccess = requestItem.status.toLowerCase() === 'success';

  return (
    <>
      <View style={styles.listMain}>
        <Row alignItems="center" justifyContent="space-between">
          <Row alignItems="center">
            <TokenLogo token={CryptoCurrencyCode.stAMB} />
            <Spacer horizontal value={scale(8)} />
            <Text fontSize={scale(12)} color={COLORS.neutral900}>
              {CryptoCurrencyCode.AMB}
            </Text>
          </Row>
          <View>
            <Text align="right" fontSize={scale(12)} color={COLORS.neutral900}>
              {amount}
            </Text>
            <Spacer value={scale(8)} />
            <Text
              color={COLORS[isSuccess ? 'success400' : 'warning400']}
              fontSize={scale(12)}
            >
              {t(isSuccess ? 'common.status.success' : 'common.status.pending')}
            </Text>
          </View>
        </Row>
        <Spacer value={scale(8)} />
        <View style={styles.dateWrapper}>
          <Row justifyContent="space-between" alignItems="center">
            <Text fontSize={scale(14)} color={COLORS.neutral600}>
              {t('harbor.requests.date')}
            </Text>
            <Text fontSize={scale(14)} color={COLORS.neutral800}>
              {requestItem.requestData}
            </Text>
          </Row>
          <Spacer value={scale(8)} />
          <Row justifyContent="space-between" alignItems="center">
            <Text fontSize={scale(14)} color={COLORS.neutral600}>
              {t('harbor.unlock.date')}
            </Text>
            <Text fontSize={scale(14)} color={COLORS.neutral800}>
              {requestItem.unlockData}
            </Text>
          </Row>
        </View>
      </View>
      <Spacer value={scale(12)} />
    </>
  );
};
