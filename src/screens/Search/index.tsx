import React, { useEffect, useState } from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import {
  Button,
  KeyboardDismissingView,
  Spacer,
  Spinner,
  Text
} from '@components/base';
import { SearchAddress } from '@components/templates';
import { useExplorerAccounts, useExplorerInfo } from '@hooks/query';
import { ExplorerWalletItem } from './components';
import { verticalScale } from '@utils/scaling';
import { ExplorerAccount } from '@models/Explorer';
import {
  SearchTabNavigationProp,
  SearchTabParamsList
} from '@appTypes/navigation';
import { SearchSort } from './Search.types';
import { COLORS } from '@constants/colors';
import { styles } from './styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

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
  const [addressFromParams, setAddressFromParams] = useState('');

  useEffect(() => {
    if (params?.address) setAddressFromParams(params.address);
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
    <View style={{ flex: 1, paddingTop: verticalScale(12), top }}>
      <View testID="Search_Screen" style={{ flex: 1 }}>
        <SearchAddress
          onContentVisibilityChanged={setSearchAddressContentVisible}
          initialValue={addressFromParams}
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
                color={COLORS.smokyBlack}
              >
                {t('top.holders')}
              </Text>
              <Spacer value={verticalScale(12)} />
            </KeyboardDismissingView>
            {accountsError ? (
              <Text>{t('no.account.info')}</Text>
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
    </View>
  );
};
