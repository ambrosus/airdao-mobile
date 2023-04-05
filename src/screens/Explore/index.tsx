import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Row, Spacer, Spinner, Text } from '@components/base';
import { styles } from './styles';
import { useExplorerAccounts, useExplorerInfo } from '@hooks/query';
import { ExplorerWalletItem, TotalAdresses } from './components';
import { verticalScale } from '@utils/scaling';
import { FilterIcon } from '@components/svg/icons';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { ExplorerAccount } from '@models/Explorer';

export const ExploreScreen = () => {
  const { data: infoData } = useExplorerInfo();
  const {
    data: accounts,
    loading: accountsLoading,
    error: accountsError
  } = useExplorerAccounts();

  const openFilter = () => {
    // TODO
  };

  const renderAccount = (args: ListRenderItemInfo<ExplorerAccount>) => {
    const { item } = args;
    return (
      <ExplorerWalletItem
        item={item}
        totalSupply={infoData?.totalSupply || 1}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TotalAdresses
        addressCount={infoData?.totalAddresses || 0}
        holderCount={infoData?.totalHolders || 0}
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
      <Spacer value={verticalScale(29)} />
      {accountsLoading ? (
        <Spinner />
      ) : accountsError ? (
        <Text>Could not load accounts info</Text>
      ) : (
        infoData &&
        accounts && (
          <FlatList<ExplorerAccount>
            data={accounts}
            renderItem={renderAccount}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <Spacer value={verticalScale(26)} />}
          />
        )
      )}
    </SafeAreaView>
  );
};
