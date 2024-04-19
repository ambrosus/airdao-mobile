import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  StyleProp,
  ViewStyle,
  View
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeOut,
  FadeOutRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
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
import { ScannerIcon, SearchLargeIcon } from '@components/svg/icons';
import { ExplorerWalletItem } from './components';
import { SearchSort } from './Search.types';
import { styles } from './styles';
import { DEVICE_HEIGHT } from '@constants/variables';
import { useAllAddressesContext } from '@contexts';
import { useWatchlist } from '@hooks';

export const SearchScreen = () => {
  const navigation = useNavigation<SearchTabNavigationProp>();
  const { refresh: refetchAddresses, addressesLoading } =
    useAllAddressesContext((v) => v);

  const { data: infoData, refetch: refetchInfo } = useExplorerInfo();
  const { t } = useTranslation();
  const {
    data: accounts,
    loading: accountsLoading,
    error: accountsError,
    hasNextPage,
    fetchNextPage,
    refetch: refetchAssets,
    refetching
  } = useExplorerAccounts(SearchSort.Balance);
  const [searchAddressContentVisible, setSearchAddressContentVisible] =
    useState(false);

  const [userPerformedRefresh, setUserPerformedRefresh] = useState(false);

  const { watchlist } = useWatchlist();

  useEffect(() => {
    if (!refetching) setUserPerformedRefresh(false);
  }, [refetching]);

  const heightAnimationValue = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: heightAnimationValue.value
    };
  });

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

    if (Object.keys(item).length === 0) {
      return (
        <Button style={styles.emptyList} activeOpacity={1}>
          <Text>{t('explore.search.no.account.info')}</Text>
        </Button>
      );
    }

    return (
      <Button onPress={navigateToWallet}>
        <ExplorerWalletItem
          item={item}
          indicatorVisible={true}
          totalSupply={infoData?.totalSupply || 0}
        />
      </Button>
    );
  };

  const _onRefresh = async () => {
    await refetchAddresses();
    setUserPerformedRefresh(true);
    if (
      typeof refetchAssets === 'function' &&
      typeof refetchInfo === 'function'
    ) {
      refetchInfo();
      refetchAssets();
    }
  };

  const renderSpinner = useCallback((style: StyleProp<ViewStyle>) => {
    return (
      <View testID="spinner" style={style}>
        <Spinner />
      </View>
    );
  }, []);

  const renderSearch = (value: boolean | ((prevState: boolean) => boolean)) => {
    setSearchAddressContentVisible(value);
    if (!!value) {
      heightAnimationValue.value = withTiming(DEVICE_HEIGHT);
    } else {
      heightAnimationValue.value = withTiming(scale(0));
    }
  };

  const showScreenSpinner = useMemo(() => {
    return userPerformedRefresh || addressesLoading;
  }, [addressesLoading, userPerformedRefresh]);

  const showFooterSpinner = useMemo((): boolean => {
    return accountsLoading && !userPerformedRefresh && watchlist.length > 0;
  }, [userPerformedRefresh, accountsLoading, watchlist]);

  return (
    <KeyboardDismissingView style={{ ...styles.main, top }}>
      {searchAddressContentVisible ? null : (
        <Row
          alignItems="center"
          justifyContent="space-between"
          style={styles.searchContainer}
        >
          <Text
            fontSize={24}
            fontFamily="Inter_700Bold"
            fontWeight="700"
            color={COLORS.neutral800}
          >
            {t('tab.explore')}
          </Text>
          <Row>
            <Button
              onPress={() =>
                setTimeout(() => searchAddressRef?.current?.focus(), 50)
              }
            >
              <SearchLargeIcon color={COLORS.alphaBlack50} />
            </Button>
            <Spacer horizontal value={scale(19)} />
            <Button onPress={searchAddressRef.current?.showScanner}>
              <ScannerIcon color={COLORS.neutral600} />
            </Button>
          </Row>
        </Row>
      )}
      <View testID="Search_Screen" style={styles.searchScreen}>
        <Animated.View style={[styles.searchMain, animatedStyle]}>
          <SearchAddress
            searchAddress
            scannerDisabled={true}
            ref={searchAddressRef}
            onContentVisibilityChanged={renderSearch}
          />
        </Animated.View>
        {searchAddressContentVisible ? null : (
          <Animated.View
            style={styles.container}
            entering={FadeIn}
            exiting={FadeOut}
          >
            <KeyboardDismissingView>
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
            {showScreenSpinner || refetching ? (
              renderSpinner(styles.spinnerFooter)
            ) : (
              <Animated.View
                entering={FadeInLeft.duration(150)}
                exiting={FadeOutRight.duration(150)}
              >
                <FlatList<ExplorerAccount>
                  // @ts-ignore
                  data={accountsError ? [{}] : accounts}
                  refreshControl={
                    <RefreshControl
                      onRefresh={_onRefresh}
                      refreshing={!!(refetching && userPerformedRefresh)}
                    />
                  }
                  renderItem={renderAccount}
                  keyExtractor={(item) => `${item._id}${Math.random()}`}
                  contentContainerStyle={styles.list}
                  showsVerticalScrollIndicator={false}
                  ItemSeparatorComponent={() => (
                    <Spacer value={verticalScale(26)} />
                  )}
                  onEndReachedThreshold={0.25}
                  onEndReached={loadMoreAccounts}
                  ListFooterComponent={
                    showFooterSpinner ? (
                      renderSpinner(styles.spinnerFooter)
                    ) : (
                      <></>
                    )
                  }
                  testID="List_Of_Addresses"
                />
              </Animated.View>
            )}
          </Animated.View>
        )}
      </View>
    </KeyboardDismissingView>
  );
};
