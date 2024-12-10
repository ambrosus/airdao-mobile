import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Header } from '@components/composite';
import { Button } from '@components/base';
import { NoteIcon } from '@components/svg/icons/v2/harbor';
import { useNavigation } from '@react-navigation/native';
import { HarborNavigationProp } from '@appTypes/navigation/harbor';

export const WithdrawHarborScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<HarborNavigationProp>();

  const RightContent = () => (
    <Button onPress={() => navigation.navigate('WithdrawRequests')}>
      <NoteIcon />
    </Button>
  );

  return (
    <SafeAreaView>
      <Header
        title={t('staking.pool.withdraw')}
        contentRight={<RightContent />}
      />
      <Text>Withdraw</Text>
    </SafeAreaView>
  );
};