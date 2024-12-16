import React from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { View } from 'react-native';
import { scale } from '@utils/scaling';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { styles } from './styles';

export const WithdrawInfo = ({}) => {
  const { t } = useTranslation();
  const {
    data: {
      unStakeDelay: { rate, delay }
    }
  } = useHarborStore();
  return (
    <View style={styles.main}>
      <Row justifyContent="space-between">
        <Text fontSize={scale(14)} color={COLORS.neutral600}>
          {t('harbor.exchange.rate')}
        </Text>
        <Text fontSize={scale(14)} color={COLORS.neutral900}>
          {rate}
        </Text>
      </Row>
      <Spacer value={scale(8)} />
      <Row justifyContent="space-between">
        <Text fontSize={scale(14)} color={COLORS.neutral600}>
          {t('harbor.withdrawal.delay')}
        </Text>
        <Text fontSize={scale(14)} color={COLORS.neutral900}>
          {delay} {t('common.days')}
        </Text>
      </Row>
    </View>
  );
};
