import React from 'react';
import { Header } from '@components/composite';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Button } from '@components/base';
import { Upload } from '@components/svg/icons/v2/harbor';
import { View } from 'react-native';
import { COLORS } from '@constants/colors';
import { HarborTabs } from '@features/harbor/components/templates';

export const StakeHarborScreen = () => {
  const { t } = useTranslation();

  const RightContent = () => (
    <Button>
      <Upload />
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
