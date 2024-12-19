import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { formatEther } from 'ethers/lib/utils';
import { Row, Spacer, Spinner, Text } from '@components/base';
import { PrimaryButton, TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import { useNavigation } from '@react-navigation/native';
import { HarborNavigationProp } from '@appTypes/navigation/harbor';
import { NumberUtils } from '@utils/number';
import { CryptoCurrencyCode } from '@appTypes';
import { styles } from './styles';
import { useAMBPrice } from '@hooks';
import { HarborDataModel } from '@entities/harbor/model/types';
import { StakeIcon } from '@components/svg/icons/v2/harbor';

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
              <Text style={styles.infoTitleText}>{t('harbor.apr')}</Text>
              <Text style={styles.aprText}>{harborAPR} %</Text>
            </Row>
            <Spacer value={scale(8)} />
            <Row justifyContent={'space-between'}>
              <Text style={styles.infoTitleText}>
                {t('harbor.total.staked')}
              </Text>
              <Text style={styles.intoText}>{totalAMBStaked} AMB</Text>
            </Row>
            <Spacer value={scale(8)} />
            <Row justifyContent={'space-between'}>
              <Text style={styles.infoTitleText}>
                {t('harbor.total.staked.value')}
              </Text>
              <Text style={styles.intoText}>
                $ {NumberUtils.minimiseAmount(+totalStakedOnHarbor.usd)}
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