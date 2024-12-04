import React from 'react';
import { Header } from '@components/composite';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Button } from '@components/base';
import { WithdrawIcon } from '@components/svg/icons/v2/harbor';
import { View } from 'react-native';
import { COLORS } from '@constants/colors';
import { HarborTabs } from '@features/harbor/components/templates';
import { useNavigation } from '@react-navigation/native';
import { HarborNavigationProp } from '@appTypes/navigation/harbor';

export const StakeHarborScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<HarborNavigationProp>();

  const RightContent = () => (
    <Button onPress={() => navigation.navigate('WithdrawHarborScreen')}>
      <WithdrawIcon />
    </Button>
  );

  return (
    <SafeAreaView>
      <Header title={t('staking.header')} contentRight={<RightContent />} />
      <View style={{ backgroundColor: COLORS.neutral100, height: '100%' }}>
        <HarborTabs />
      </View>
    </SafeAreaView>
  );
};
