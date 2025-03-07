import { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CryptoCurrencyCode } from '@appTypes';
import { Row, Spacer, Text } from '@components/base';
import { TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';
import { styles } from './styles';

interface StakedDetailsProps extends PropsWithChildren {
  readonly amount?: number | string;
  readonly token?: CryptoCurrencyCode;
}

export const StakedDetails = ({
  amount = '0.00',
  token = CryptoCurrencyCode.HBR,
  children
}: StakedDetailsProps) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Row alignItems="center" justifyContent="space-between">
          {/* Token Details */}
          <Row alignItems="center">
            <TokenLogo
              token={token}
              scale={CryptoCurrencyCode.HBR === token ? 1.2 : 1}
            />
            <Spacer horizontal value={scale(8)} />
            <Text
              fontSize={14}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral900}
            >
              {token}
            </Text>
          </Row>

          <View style={styles.rightColumnContainer}>
            <Text fontSize={12} fontFamily="Inter_500Medium" color="#585E77">
              {t('harbor.staked.amount')}
            </Text>
            <Spacer value={scale(8)} />
            <Text
              fontSize={14}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral900}
            >
              {amount}
            </Text>
          </View>
        </Row>
      </View>
      {children}
    </View>
  );
};
