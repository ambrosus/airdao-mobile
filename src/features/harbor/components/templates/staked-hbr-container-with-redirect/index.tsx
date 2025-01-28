import { useMemo, useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { CryptoCurrencyCode } from '@appTypes';
import { HarborTabParamsList } from '@appTypes/navigation/harbor';
import { Row, Spacer, Text } from '@components/base';
import { SecondaryButton } from '@components/modular';
import { StakeIcon, WithdrawIcon } from '@components/svg/icons/v2/harbor';
import { COLORS } from '@constants/colors';
import { useStakeHBRStore } from '@entities/harbor';
import { StakedDetails } from '@entities/harbor/components/composite';
import { NumberUtils, scale } from '@utils';
import { styles } from './styles';

export const StakedHBRContainerWithRedirect = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<HarborTabParamsList>>();
  const [loading] = useState(false);
  const { deposit } = useStakeHBRStore();

  const onStakeButtonPress = () => {
    navigation.navigate('StakeHBRScreen');
  };

  const onWithdrawButtonPress = () => {
    navigation.navigate('WithdrawHarborPoolScreen', {
      token: CryptoCurrencyCode.HBR,
      logs: null
    });
  };

  const disabled = useMemo(() => deposit.isZero(), [deposit]);

  return (
    <StakedDetails
      amount={NumberUtils.numberToTransformedLocale(
        ethers.utils.formatEther(deposit)
      )}
    >
      <Row
        alignItems="center"
        justifyContent="space-between"
        style={styles.footer}
      >
        <SecondaryButton
          style={styles.primaryButton}
          disabled={loading}
          onPress={onStakeButtonPress}
        >
          <Row alignItems="center" justifyContent="center">
            <StakeIcon color={COLORS[loading ? 'brand300' : 'neutral0']} />
            <Spacer horizontal value={scale(10)} />
            <Text
              align="justify"
              color={COLORS[loading ? 'brand300' : 'neutral0']}
            >
              {t('staking.header')}
            </Text>
          </Row>
        </SecondaryButton>

        <SecondaryButton
          style={styles.secondaryButton}
          disabled={disabled}
          onPress={onWithdrawButtonPress}
        >
          <Row justifyContent="center" alignItems="center">
            <WithdrawIcon
              color={COLORS[disabled ? 'neutral400' : 'neutral900']}
            />
            <Spacer horizontal value={scale(10)} />
            <Text
              align="justify"
              color={COLORS[disabled ? 'neutral400' : 'neutral900']}
            >
              {t('harbor.withdraw.header')}
            </Text>
          </Row>
        </SecondaryButton>
      </Row>
    </StakedDetails>
  );
};
