import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { formatEther } from 'ethers/lib/utils';
import { useTranslation } from 'react-i18next';
import { CryptoCurrencyCode } from '@appTypes';
import { HarborNavigationProp } from '@appTypes/navigation/harbor';
import { Row, Spacer, Spinner, Text } from '@components/base';
import { PrimaryButton, TokenLogo } from '@components/modular';
import { StakeIcon } from '@components/svg/icons/v2/harbor';
import { COLORS } from '@constants/colors';
import { HarborDataModel } from '@entities/harbor/model/types';
import { useAMBPrice } from '@hooks';
import { NumberUtils, scale } from '@utils';
import { styles } from './styles';

interface StakeInfoContainerProps {
  loading: boolean;
  harborData: HarborDataModel;
}

export const StakeInfoContainer = ({
  loading,
  harborData
}: StakeInfoContainerProps) => {
  const navigation = useNavigation<HarborNavigationProp>();
  const { t } = useTranslation();
  const { data: ambPrice } = useAMBPrice();
  const { apr: harborAPR, totalStaked, userStaked } = harborData;

  const totalStakedOnHarbor = {
    crypto: NumberUtils.limitDecimalCount(formatEther(totalStaked), 2),
    usd: NumberUtils.limitDecimalCount(
      (ambPrice?.priceUSD || 1) * +formatEther(totalStaked),
      2
    )
  };

  const navigateToStake = () => {
    if (loading) {
      return;
    }
    navigation.navigate('ProcessStake');
  };

  const totalAMBStaked = NumberUtils.minimiseAmount(
    +NumberUtils.limitDecimalCount(totalStakedOnHarbor.crypto, 2)
  );
  return (
    <View style={styles.main}>
      {loading ? (
        <Spinner size="large" />
      ) : (
        <>
          <Row alignItems="center" justifyContent="space-between">
            <Row alignItems="center">
              <TokenLogo token={'amb'} />
              <Spacer horizontal value={scale(8)} />
              <Text style={styles.topText} color={COLORS.neutral900}>
                {CryptoCurrencyCode.stAMB}
              </Text>
            </Row>
            <View style={{ alignItems: 'flex-end' }}>
              <Text fontSize={scale(12)}>{t('harbor.staked.amount')}</Text>
              <Spacer value={scale(8)} />
              <Text style={styles.topText} color={COLORS.neutral900}>
                {NumberUtils.numberToTransformedLocale(
                  NumberUtils.limitDecimalCount(formatEther(userStaked), 2)
                )}
              </Text>
            </View>
          </Row>
          <Spacer value={scale(15)} />
          <View style={styles.infoMain}>
            <Row justifyContent={'space-between'}>
              <Text
                fontSize={14}
                fontFamily="Inter_500Medium"
                color={COLORS.neutral600}
              >
                {t('harbor.apr')}
              </Text>
              <Text
                fontSize={14}
                fontFamily="Inter_500Medium"
                color={COLORS.success500}
              >
                {harborAPR} %
              </Text>
            </Row>
            <Row justifyContent={'space-between'}>
              <Text
                fontSize={14}
                fontFamily="Inter_500Medium"
                color={COLORS.neutral600}
              >
                {t('harbor.total.staked')}
              </Text>
              <Text
                fontSize={14}
                fontFamily="Inter_500Medium"
                color={COLORS.neutral900}
              >
                {totalAMBStaked} AMB
              </Text>
            </Row>
            <Row justifyContent={'space-between'}>
              <Text
                fontSize={14}
                fontFamily="Inter_500Medium"
                color={COLORS.neutral600}
              >
                {t('harbor.total.staked.value')}
              </Text>
              <Text
                fontSize={14}
                fontFamily="Inter_500Medium"
                color={COLORS.neutral900}
              >
                ${NumberUtils.minimiseAmount(+totalStakedOnHarbor.usd)}
              </Text>
            </Row>
          </View>
        </>
      )}

      <Spacer value={scale(16)} />
      <PrimaryButton disabled={loading} onPress={navigateToStake}>
        <Row justifyContent="center" alignItems="center">
          <StakeIcon color={COLORS[loading ? 'brand300' : 'neutral0']} />
          <Spacer horizontal value={scale(10)} />
          <Text
            align="justify"
            color={COLORS[loading ? 'brand300' : 'neutral0']}
          >
            {t('staking.header')}
          </Text>
        </Row>
      </PrimaryButton>
    </View>
  );
};
