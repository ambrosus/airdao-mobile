import React, { useEffect, useRef, useState } from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import {
  Button,
  KeyboardDismissingView,
  Row,
  Spacer,
  Spinner,
  Text
} from '@components/base';
import { SearchAddress, SearchAddressRef } from '@components/templates';
import { useExplorerAccounts, useExplorerInfo } from '@hooks/query';
import { scale, verticalScale } from '@utils/scaling';
import { ExplorerAccount } from '@models/Explorer';
import {
  SearchTabNavigationProp,
  SearchTabParamsList
} from '@appTypes/navigation';
import { COLORS } from '@constants/colors';
import { ScannerQRIcon } from '@components/svg/icons';
import { ExplorerWalletItem } from './components';
import { SearchSort } from './Search.types';
import { styles } from './styles';

export const SearchScreen = () => {
  const navigation = useNavigation<SearchTabNavigationProp>();
  const { data: infoData } = useExplorerInfo();
  const { t } = useTranslation();
  const {
    data: accounts,
    loading: accountsLoading,
    error: accountsError,
    hasNextPage,
    fetchNextPage
  } = useExplorerAccounts(SearchSort.Balance);
  const [searchAddressContentVisible, setSearchAddressContentVisible] =
    useState(false);

  const { top } = useSafeAreaInsets();

  const { params } = useRoute<RouteProp<SearchTabParamsList, 'SearchScreen'>>();
  const searchAddressRef = useRef<SearchAddressRef>(null);

  useEffect(() => {
    if (params?.address) searchAddressRef.current?.setAddress(params.address);
  }, [params?.address]);

  const loadMoreAccounts = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const renderAccount = (args: ListRenderItemInfo<ExplorerAccount>) => {
    const { item } = args;
    const navigateToWallet = () => {
      navigation.navigate('Address', { address: item.address });
    };
    return (
      <Button onPress={navigateToWallet}>
        <ExplorerWalletItem
          item={item}
          indicatorVisible={true}
          totalSupply={infoData?.totalSupply || 1}
        />
      </Button>
    );
  };

  const renderSpinner = () => {
    return (
      <View testID="spinner">
        <Spinner />
        <Spacer value={verticalScale(24)} />
      </View>
    );
  };

  return (
    <KeyboardDismissingView
      style={{ flex: 1, paddingTop: verticalScale(12), top }}
    >
      <Row
        alignItems="center"
        justifyContent="space-between"
        style={{
          paddingHorizontal: scale(16),
          paddingBottom: verticalScale(22),
          borderBottomWidth: 1,
          borderBottomColor: COLORS.neutral100
        }}
      >
        <Text
          fontSize={24}
          fontFamily="Inter_700Bold"
          fontWeight="700"
          color={COLORS.neutral800}
        >
          {t('tab.explore')}
        </Text>
        <Button onPress={searchAddressRef.current?.showScanner}>
          <ScannerQRIcon />
        </Button>
      </Row>
      <View
        testID="Search_Screen"
        style={{ flex: 1, marginTop: verticalScale(16) }}
      >
        <SearchAddress
          scannerDisabled={true}
          ref={searchAddressRef}
          onContentVisibilityChanged={setSearchAddressContentVisible}
        />
        {searchAddressContentVisible ? null : (
          <Animated.View
            style={styles.container}
            entering={FadeIn}
            exiting={FadeOut}
          >
            <KeyboardDismissingView>
              <Spacer value={verticalScale(32)} />
              <Text
                fontFamily="Inter_700Bold"
                fontWeight="700"
                fontSize={20}
                color={COLORS.neutral900}
              >
                {t('common.top.holders')}
              </Text>
              <Spacer value={verticalScale(12)} />
            </KeyboardDismissingView>
            {accountsError ? (
              <Text>{t('explore.search.no.account.info')}</Text>
            ) : (
              infoData &&
              accounts && (
                <>
                  <FlatList<ExplorerAccount>
                    data={accounts}
                    renderItem={renderAccount}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => (
                      <Spacer value={verticalScale(26)} />
                    )}
                    onEndReachedThreshold={0.25}
                    onEndReached={loadMoreAccounts}
                    ListFooterComponent={() =>
                      accountsLoading ? renderSpinner() : <></>
                    }
                    testID="List_Of_Addresses"
                  />
                </>
              )
            )}
          </Animated.View>
        )}
      </View>
    </KeyboardDismissingView>
  );
};
