import { useEffect } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HarborNavigationProp } from '@appTypes/navigation/harbor';
import { HeaderWithWithdrawal } from '@entities/harbor/components/composite';
import { useStakeHBRStore, useStakeUIStore } from '@entities/harbor/model';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { useWalletStore } from '@entities/wallet';
import { HarborStakeTabs } from '@features/harbor/components/tabs';
import { styles } from './styles';

export const StakeHarborScreen = () => {
  const navigation = useNavigation<HarborNavigationProp>();
  const { updateAll } = useHarborStore();
  const { hbrYieldFetcher } = useStakeHBRStore();
  const { wallet } = useWalletStore();
  const { setActiveTabIndex } = useStakeUIStore();

  useEffect(() => {
    Promise.all([
      updateAll(wallet?.address || ''),
      hbrYieldFetcher(wallet?.address || '')
    ]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet?.address]);

  useEffect(() => {
    // Reset active tab index when going back
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      if (event.data.action.type === 'GO_BACK') {
        setActiveTabIndex(0);
      }
    });

    return unsubscribe;
  }, [navigation, setActiveTabIndex]);

  return (
    <SafeAreaView>
      <HeaderWithWithdrawal />
      <View style={styles.main}>
        <HarborStakeTabs />
      </View>
    </SafeAreaView>
  );
};
