import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { scale } from '@utils';
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
