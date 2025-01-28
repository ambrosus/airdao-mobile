import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CryptoCurrencyCode } from '@appTypes';
import { Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale, NumberUtils } from '@utils';
import { styles } from './styles';

interface RateInfoModel {
  availableToStake: string;
  rate?: number;
}
export const RateInfo = ({ availableToStake, rate = 1 }: RateInfoModel) => {
  const { t } = useTranslation();
  return (
    <View style={styles.main}>
      <Row justifyContent="space-between">
        <Text style={styles.title}>{t('harbor.exchange.rate')}</Text>
        <Text style={styles.text}>
          1 AMB = {rate}
          {CryptoCurrencyCode.stAMB}
        </Text>
      </Row>
      <Spacer value={scale(16)} />
      <Row justifyContent="space-between">
        <Text style={styles.title}>{t('harbor.stake.available')}</Text>
        <Text style={styles.text}>
          {NumberUtils.minimiseAmount(+availableToStake)}{' '}
          <Text color={COLORS.neutral600}>AMB</Text>
        </Text>
      </Row>
    </View>
  );
};
