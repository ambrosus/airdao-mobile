import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HarborNavigationProp } from '@appTypes/navigation/harbor';
import { Button } from '@components/base';
import { Header } from '@components/composite';
import { WithdrawIcon } from '@components/svg/icons/v2/harbor';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { useWalletStore } from '@entities/wallet';
import { HarborStakeTabs } from '@features/harbor/components/tabs';
import { styles } from './styles';

export const StakeHarborScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<HarborNavigationProp>();
  const { updateAll, loading } = useHarborStore();
  const { wallet } = useWalletStore();

  useEffect(() => {
    updateAll(wallet?.address || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet?.address]);

  const RightContent = () => (
    <Button
      onPress={() => {
        if (loading) {
          return;
        }
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
