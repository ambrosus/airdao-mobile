import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Header } from '@components/composite';
import { Button } from '@components/base';
import { WithdrawIcon } from '@components/svg/icons/v2/harbor';
import { HarborStakeTabs } from '@features/harbor/components/templates';
import { useNavigation } from '@react-navigation/native';
import { HarborNavigationProp } from '@appTypes/navigation/harbor';
import { styles } from './styles';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { useEffectOnce } from '@hooks';
import { useWalletStore } from '@entities/wallet';

export const StakeHarborScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<HarborNavigationProp>();
  const { updateAll } = useHarborStore();
  const { wallet } = useWalletStore();
  useEffectOnce(() => {
    updateAll(wallet?.address || '');
  });

  const RightContent = () => (
    <Button
      onPress={() => {
        // if (loading) {
        //   return;
        // }
        navigation.navigate('WithdrawHarborScreen');
      }}
    >
      <WithdrawIcon />
    </Button>
  );

  return (
    <SafeAreaView>
      <Header title={t('staking.header')} contentRight={<RightContent />} />
      <View style={styles.main}>
        <HarborStakeTabs />
      </View>
    </SafeAreaView>
  );
};
