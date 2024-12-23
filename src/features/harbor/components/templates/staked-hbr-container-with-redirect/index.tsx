import React, { useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { HarborTabParamsList } from '@appTypes/navigation/harbor';
import { Row, Spacer, Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { StakeIcon } from '@components/svg/icons/v2/harbor';
import { COLORS } from '@constants/colors';
import { useStakeHBRStore } from '@entities/harbor';
import { StakedDetails } from '@entities/harbor/components/composite';
import { NumberUtils, scale } from '@utils';

export const StakedHBRContainerWithRedirect = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<HarborTabParamsList>>();
  const [loading] = useState(false);
  const { deposit } = useStakeHBRStore();

  const onStakeButtonPress = () => {
    navigation.navigate('StakeHBRScreen');
  };

  return (
    <StakedDetails
      amount={NumberUtils.numberToTransformedLocale(
        ethers.utils.formatEther(deposit)
      )}
    >
      <PrimaryButton disabled={loading} onPress={onStakeButtonPress}>
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
    </StakedDetails>
  );
};
