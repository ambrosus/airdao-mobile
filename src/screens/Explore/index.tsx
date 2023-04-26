import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import {
  Button,
  KeyboardDismissingView,
  Row,
  Spacer,
  Spinner,
  Text
} from '@components/base';
import { BottomSheetRef } from '@components/composite';
import { SearchAddress } from '@components/templates';
import { useExplorerAccounts, useExplorerInfo } from '@hooks/query';
import {
  BottomSheetWalletSort,
  ExplorerWalletItem,
  TotalAdresses
} from './components';
import { verticalScale } from '@utils/scaling';
import { FilterIcon } from '@components/svg/icons';
import { ExplorerAccount } from '@models/Explorer';
import { ExplorerSort } from './Explore.types';
import { ExploreTabParamsList } from '@appTypes/navigation';
import { styles } from './styles';

export const ExploreScreen = () => {
  const { data: infoData } = useExplorerInfo();
  const [sortBy, setSortBy] = useState(ExplorerSort.Balance);
  const {
    data: accounts,
    loading: accountsLoading,
    error: accountsError
  } = useExplorerAccounts(sortBy);
  const sortModal = useRef<BottomSheetRef>(null);
  const [searchAddressContentVisible, setSearchAddressContentVisible] =
    useState(false);

  const { params } = useRoute<RouteProp<ExploreTabParamsList>>();
  const [addressFromParams, setAddressFromParams] = useState('');

  useEffect(() => {
    if (params?.address) setAddressFromParams(params.address);
  }, [params?.address]);

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
    <SafeAreaView style={{ flex: 1, paddingTop: verticalScale(12) }}>
      <KeyboardDismissingView
        style={{ flex: 1 }}
        disabled={!searchAddressContentVisible}
      >
        <SearchAddress
          onContentVisibilityChanged={setSearchAddressContentVisible}
          initialValue={addressFromParams}
          withOnboarding
        />
        {searchAddressContentVisible ? null : (
          <Animated.View
            style={styles.container}
            entering={FadeIn}
            exiting={FadeOut}
          >
            <KeyboardDismissingView>
              <Spacer value={verticalScale(25)} />
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
              <Spacer value={verticalScale(12)} />
            </KeyboardDismissingView>
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
          </Animated.View>
        )}
      </KeyboardDismissingView>
    </SafeAreaView>
  );
};
