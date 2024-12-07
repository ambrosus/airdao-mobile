import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useStakeAmbData } from '@features/harbor/hooks/useStakeAmbData';
import { Row, Spacer, Spinner, Text } from '@components/base';
import { PrimaryButton, TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import { useNavigation } from '@react-navigation/native';
import { HarborNavigationProp } from '@appTypes/navigation/harbor';
import { PlusIcon } from '@components/svg/icons/v2';
import { NumberUtils } from '@utils/number';
import { CryptoCurrencyCode } from '@appTypes';

import { styles } from './styles';

export const StakeInfoContainer = () => {
  const navigation = useNavigation<HarborNavigationProp>();
  const { t } = useTranslation();
  const { currentUserStakedAmount, harborAPR, totalStakedOnHarbor, loading } =
    useStakeAmbData();

  const navigateToStake = () => navigation.navigate('ProcessStake');

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
              <Text fontSize={12}>t{'harbor.staked.amount'}</Text>
              <Spacer value={scale(8)} />
              <Text style={styles.topText} color={COLORS.neutral900}>
                {NumberUtils.limitDecimalCount(currentUserStakedAmount, 2)}
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
      <PrimaryButton onPress={navigateToStake}>
        <Row>
          <PlusIcon color={COLORS.neutral0} />
          <Spacer horizontal value={scale(10)} />
          <Text color={COLORS.neutral0}>{t('staking.header')}</Text>
        </Row>
      </PrimaryButton>
    </View>
  );
};
