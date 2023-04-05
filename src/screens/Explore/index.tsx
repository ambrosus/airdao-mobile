import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Row, Spacer, Text } from '@components/base';
import { styles } from './styles';
import { useExplorerInfo } from '@hooks/query';
import { TotalAdresses } from './components';
import { verticalScale } from '@utils/scaling';
import { FilterIcon } from '@components/svg/icons';

export const ExploreScreen = () => {
  const { data: explorerInfoData } = useExplorerInfo();

  const openFilter = () => {
    // TODO
  };

  return (
    <SafeAreaView style={styles.container}>
      <TotalAdresses
        addressCount={explorerInfoData?.totalAddresses || 0}
        holderCount={explorerInfoData?.totalHolders || 0}
      />
      <Spacer value={verticalScale(29)} />
      <Row justifyContent="space-between" alignItems="center">
        <Text fontFamily="Inter_700Bold" fontWeight="600" fontSize={20}>
          Popular Wallets
        </Text>
        <Button onPress={openFilter}>
          <FilterIcon />
        </Button>
      </Row>
    </SafeAreaView>
  );
};
