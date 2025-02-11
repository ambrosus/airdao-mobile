import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  InteractionManager,
  ListRenderItemInfo,
  RefreshControl,
  StyleProp,
  View,
  ViewStyle
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Animated, {
  Easing,
  Extrapolation,
  FadeIn,
  FadeInLeft,
  FadeOut,
  FadeOutRight,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  SearchTabNavigationProp,
  SearchTabParamsList
} from '@appTypes/navigation';
import {
  Button,
  KeyboardDismissingView,
  Spacer,
  Spinner,
  Text
} from '@components/base';
import { Header } from '@components/composite';
import { ScannerIcon, SearchLargeIcon } from '@components/svg/icons';
import { SearchAddress, SearchAddressRef } from '@components/templates';
import { COLORS } from '@constants/colors';
import { DEVICE_HEIGHT } from '@constants/variables';
import { useAddressesStore, useFetchAddresses } from '@entities/addresses';
import { useWatchlist } from '@hooks';
import { useExplorerAccounts, useExplorerInfo } from '@hooks/query';
import { useProgressViewOffset } from '@hooks/ui';
import {
  CustomAppEvents,
  sendFirebaseEvent
} from '@lib/firebaseEventAnalytics';
import { ExplorerAccount } from '@models/Explorer';
import { scale, verticalScale } from '@utils';
import { ExplorerWalletItem } from './components';
import { SearchSort } from './Search.types';
import { styles } from './styles';

export const Explore = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<SearchTabNavigationProp>();
  const { params } = useRoute<RouteProp<SearchTabParamsList, 'Explore'>>();
  const progressViewOffset = useProgressViewOffset();

  const searchAddressRef = useRef<SearchAddressRef>(null);

  const [searchAddressContentVisible, setSearchAddressContentVisible] =
    useState(false);

  const { watchlist } = useWatchlist();
  const { loading: addressesLoading } = useAddressesStore();
  const { refetch: refetchAddresses } = useFetchAddresses();

  const { data: infoData, refetch: refetchInfo } = useExplorerInfo();
  const {
    data: accounts,
    loading: accountsLoading,
    error: accountsError,
    hasNextPage,
    fetchNextPage,
    refetch: refetchAssets,
    refetching
  } = useExplorerAccounts(SearchSort.Balance);

  const [userPerformedRefresh, setUserPerformedRefresh] = useState(false);

  useEffect(() => {
    if (!refetching) setUserPerformedRefresh(false);
  }, [refetching]);

  const heightAnimationValue = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        heightAnimationValue.value,
        [0, DEVICE_HEIGHT],
        [0, DEVICE_HEIGHT],
        Extrapolation.CLAMP
      )
    };
  }, [heightAnimationValue]);

  useEffect(() => {
    if (params?.address) searchAddressRef.current?.setAddress(params.address);
  }, [params?.address]);

  const loadMoreAccounts = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const renderAccount = useCallback(
    (args: ListRenderItemInfo<ExplorerAccount>) => {
      const { item } = args;
      const navigateToWallet = () => {
        sendFirebaseEvent(CustomAppEvents.explorer_address_open);
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
    },
    [infoData?.totalSupply, navigation, t]
  );

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

  const renderSearch = useCallback(
    (value: boolean | ((prevState: boolean) => boolean)) => {
      setTimeout(
        () => {
          setSearchAddressContentVisible(value);
        },
        !!value ? 0 : 300
      );

      heightAnimationValue.value = withTiming(value ? DEVICE_HEIGHT : 0, {
        duration: 300,
        easing: Easing.linear
      });
    },
    [heightAnimationValue]
  );

  const showScreenSpinner = useMemo(() => {
    return userPerformedRefresh || addressesLoading;
  }, [addressesLoading, userPerformedRefresh]);

  const showFooterSpinner = useMemo((): boolean => {
    return accountsLoading && !userPerformedRefresh && watchlist.length > 0;
  }, [userPerformedRefresh, accountsLoading, watchlist]);

  const onSearchFocusHandle = useCallback(() => {
    InteractionManager.runAfterInteractions(() => {
      searchAddressRef?.current?.focus();
    });
  }, []);

  const headerContentRightNode = useMemo(
    () => (
      <>
        <Button onPress={onSearchFocusHandle}>
          <SearchLargeIcon color={COLORS.alphaBlack50} />
        </Button>
        <Spacer horizontal value={scale(19)} />
        <Button onPress={searchAddressRef.current?.showScanner}>
          <ScannerIcon color={COLORS.neutral600} />
        </Button>
      </>
    ),
    [onSearchFocusHandle]
  );

  return (
    <SafeAreaView style={styles.main}>
      {!searchAddressContentVisible && (
        <Header
          onBackPress={navigation.goBack}
          title={t('tab.explore')}
          bottomBorder
          contentRight={headerContentRightNode}
        />
      )}
      <Spacer value={15} />
      <View testID="Search_Screen" style={styles.searchScreen}>
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={[styles.searchMain, animatedStyle]}
        >
          <SearchAddress
            searchAddress
            scannerDisabled={true}
            ref={searchAddressRef}
            onContentVisibilityChanged={renderSearch}
          />
        </Animated.View>
        {!searchAddressContentVisible && (
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
            {showScreenSpinner ? (
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
                      progressViewOffset={progressViewOffset}
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
    </SafeAreaView>
  );
};
