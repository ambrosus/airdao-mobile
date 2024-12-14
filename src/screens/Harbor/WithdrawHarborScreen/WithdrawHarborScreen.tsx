import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Header } from '@components/composite';
import { Button } from '@components/base';
import { NoteIcon } from '@components/svg/icons/v2/harbor';
import { useNavigation } from '@react-navigation/native';
import { HarborNavigationProp } from '@appTypes/navigation/harbor';
import { styles } from './styles';
import { useEffectOnce } from '@hooks';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { useWalletStore } from '@entities/wallet';
import { HarborWithdrawTabs } from '@features/harbor/components/tabs';

export const WithdrawHarborScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<HarborNavigationProp>();
  const { getClaimAmount } = useHarborStore();
  const { wallet } = useWalletStore();
  useEffectOnce(() => {
    getClaimAmount(wallet?.address || '');
  });
  const RightContent = () => (
    <Button onPress={() => navigation.navigate('WithdrawRequests')}>
      <NoteIcon />
    </Button>
  );

  return (
    <SafeAreaView>
      <Header
        title={`${t('harbor.withdraw.header')} AMB`}
        contentRight={<RightContent />}
      />
      <View style={styles.main}>
        <HarborWithdrawTabs />
      </View>
    </SafeAreaView>
  );
};
