import React, { useMemo, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Row, Spacer, Spinner, Text } from '@components/base';
import { styles } from './styles';
import { useExplorerAccounts, useExplorerInfo } from '@hooks/query';
import {
  BottomSheetWalletSort,
  ExplorerWalletItem,
  TotalAdresses
} from './components';
import { verticalScale } from '@utils/scaling';
import { FilterIcon } from '@components/svg/icons';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { ExplorerAccount } from '@models/Explorer';
import { BottomSheetRef } from '@components/composite';
import { ExplorerSort } from './Explore.types';

export const ExploreScreen = () => {
  const { data: infoData } = useExplorerInfo();
  const {
    data: accounts,
    loading: accountsLoading,
    error: accountsError
  } = useExplorerAccounts();

  const sortModal = useRef<BottomSheetRef>(null);

  const [sortBy, setSortBy] = useState(ExplorerSort.Balance);

  const sortedAccounts = useMemo(() => {
    if (sortBy && accounts) {
      switch (sortBy as ExplorerSort) {
        case ExplorerSort.Balance: {
          return accounts.sort((a, b) => b.ambBalance - a.ambBalance);
        }
        case ExplorerSort['Transaction Count']: {
          return accounts.sort(
            (a, b) => b.transactionCount - a.transactionCount
          );
        }
        default:
          return accounts;
      }
    }
    return accounts;
  }, [sortBy, accounts]);

  const openFilter = () => {
    sortModal.current?.show();
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
        sortedAccounts && (
          <>
            <FlatList<ExplorerAccount>
              data={sortedAccounts}
              renderItem={renderAccount}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => (
                <Spacer value={verticalScale(26)} />
              )}
            />
            <BottomSheetWalletSort
              ref={sortModal}
              sort={sortBy}
              setSort={setSortBy}
            />
          </>
        )
      )}
    </SafeAreaView>
  );
};
