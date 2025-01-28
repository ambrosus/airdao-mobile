import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderWithWithdrawal } from '@entities/harbor/components/composite';
import { useStakeHBRStore } from '@entities/harbor/model';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { useWalletStore } from '@entities/wallet';
import { HarborStakeTabs } from '@features/harbor/components/tabs';
import { styles } from './styles';

export const StakeHarborScreen = () => {
  const { updateAll } = useHarborStore();
  const { hbrYieldFetcher } = useStakeHBRStore();
  const { wallet } = useWalletStore();

  useEffect(() => {
    updateAll(wallet?.address || '');
    hbrYieldFetcher(wallet?.address || '');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet?.address]);

  return (
    <SafeAreaView>
      <HeaderWithWithdrawal />
      <View style={styles.main}>
        <HarborStakeTabs />
      </View>
    </SafeAreaView>
  );
};
