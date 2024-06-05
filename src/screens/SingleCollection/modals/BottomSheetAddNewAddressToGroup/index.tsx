import React, {
  ForwardedRef,
  forwardRef,
  RefObject,
  useCallback,
  useRef,
  useState
} from 'react';
import {
  Alert,
  FlatList,
  ListRenderItemInfo,
  ScrollView,
  useWindowDimensions,
  View
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchAddressNoResult } from '@components/templates/SearchAddress/SearchAddress.NoMatch';
import {
  BottomSheet,
  BottomSheetRef,
  CheckBox,
  Header,
  InputWithIcon,
  Segment,
  SegmentedPicker
} from '@components/composite';
import { PrimaryButton } from '@components/modular';
import { Button, InputRef, Row, Spacer, Spinner, Text } from '@components/base';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { CloseIcon, ScannerQRIcon, SearchIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { useLists } from '@contexts/ListsContext';
import { useExplorerAccounts, useSearchAccount, useWatchlist } from '@hooks';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { BarcodeScanner } from '@components/templates';
import { AccountList, ExplorerAccount } from '@models';
import { SearchSort } from '@screens/Search/Search.types';
import { ExplorerWalletItem } from '@screens/Search/components';
import { etherumAddressRegex } from '@constants/regex';
import { styles } from './styles';

type Props = {
  ref: RefObject<BottomSheetRef>;
  collection: AccountList;
};

export const BottomSheetAddNewAddressToGroup = forwardRef<
  BottomSheetRef,
  Props
>(({ collection }, ref) => {
  const {
    data: topHolders,
    loading: topHoldersLoading,
    // error: topHoldersError,
    hasNextPage: hasMoreTopHolders,
    fetchNextPage: fetchMoreTopHolders
  } = useExplorerAccounts(SearchSort.Balance);
  const [searchValue, setSearchValue] = useState<string>('');
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();

  const AddressSources: Segment[] = [
    {
      title: t('common.top.holders.capitalize'),
      value: 0,
      id: 'topHolders'
    },
    {
      title: t('tab.watchlist'),
      value: 1,
      id: 'watchlist'
    }
  ];

  const {
    data: searchedAccount,
    loading: searchLoading,
    error: searchError
  } = useSearchAccount(searchValue, !!searchValue);
  const { watchlist } = useWatchlist();
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const toggleAddressesInList = useLists((v) => v.toggleAddressesInList);
  const [scrollViewIdx, setScrollViewIdx] = useState<
    'watchlist' | 'topHolders'
  >('topHolders');
  const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = useWindowDimensions();
  const tabWidth = WINDOW_WIDTH - scale(48);

  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<InputRef>(null);
  const scannerModalRef = useRef<BottomSheetRef>(null);
  const scanned = useRef(false);
  const [selectedAddresses, setSelectedAddresses] = useState<ExplorerAccount[]>(
    []
  );

  const selectionStarted = selectedAddresses.length > 0;
  const selectingAddedItems = selectionStarted
    ? collection.accounts.some(
        (account) => account._id === selectedAddresses[0]._id
      )
    : false;

  const resetState = () => {
    setSearchValue('');
    setSelectedAddresses([]);
    setScrollViewIdx('topHolders');
    scrollRef.current?.scrollTo({ x: 0, animated: false });
  };

  const handleItemPress = useCallback(
    (item: ExplorerAccount) => {
      const idx = selectedAddresses.indexOfItem(item, '_id');
      if (idx > -1) selectedAddresses.splice(idx, 1);
      else selectedAddresses.push(item);
      setSelectedAddresses([...selectedAddresses]);
    },
    [selectedAddresses]
  );

  const renderItem = (
    args: ListRenderItemInfo<ExplorerAccount>
  ): JSX.Element => {
    const { item } = args;
    const selected = selectedAddresses.indexOfItem(item, '_id') > -1;
    const itemExistsInCollection =
      collection.accounts.indexOfItem(item, '_id') > -1;
    const disabled =
      selectionStarted &&
      (selectingAddedItems ? !itemExistsInCollection : itemExistsInCollection);
    return (
      <Button
        onPress={() => {
          if (!disabled) handleItemPress(item);
        }}
        onLongPress={() => {
          if (!disabled) handleItemPress(item);
        }}
        activeOpacity={disabled ? 0.5 : undefined}
        style={{ ...styles.item, opacity: disabled ? 0.5 : 1 }}
      >
        <Row alignItems="center">
          {selectionStarted && (
            <Row>
              <CheckBox
                fillColor={COLORS.brand500}
                color={COLORS.neutral0}
                type="square"
                value={selected}
              />
              <Spacer horizontal value={scale(16)} />
            </Row>
          )}
          <View style={{ flex: 1 }}>
            <ExplorerWalletItem
              item={item}
              indicatorVisible={true}
              totalSupply={6500000000}
            />
          </View>
        </Row>
      </Button>
    );
  };

  const loadMoreTopHolders = () => {
    if (hasMoreTopHolders) {
      fetchMoreTopHolders();
    }
  };

  const onSelectSegment = (segment: Segment) => {
    const idx = AddressSources.findIndex((s) => s.id === segment.id);
    scrollRef.current?.scrollTo({ x: tabWidth * idx, animated: true });
    setScrollViewIdx(segment.id as any);
  };

  const showScanner = () => {
    scannerModalRef.current?.show();
  };

  const hideScanner = () => {
    scannerModalRef.current?.dismiss();
  };

  const onQRCodeScanned = (data: string) => {
    const res = data.match(etherumAddressRegex);
    if (res && res?.length > 0) {
      hideScanner();
      inputRef.current?.setText(res[0]);
      setTimeout(() => {
        setSearchValue(res[0]);
      }, 500);
    } else if (!scanned.current) {
      scanned.current = true;
      Alert.alert(t('alert.invalid.qr.code.msg'), '', [
        {
          text: t('alert.scan.again.msg'),
          onPress: () => {
            scanned.current = false;
          }
        }
      ]);
    }
  };

  const submitSelectedAddresses = () => {
    localRef.current?.dismiss();
    toggleAddressesInList(selectedAddresses, collection);
    resetState();
  };

  const clearSearch = () => {
    setSearchValue('');
    setScrollViewIdx('topHolders');
  };

  return (
    <BottomSheet
      ref={localRef}
      height={'100%'}
      avoidKeyboard={false}
      containerStyle={
        {
          // paddingHorizontal: scale(24)
        }
      }
      borderRadius={0}
      onClose={resetState}
    >
      <View
        // style={{ alignItems: 'center' }}
        testID="bottom-sheet-add-new-address"
      >
        <Spacer value={top} />
        <Header
          backIconVisible={false}
          contentLeft={
            <Button onPress={localRef.current?.dismiss}>
              <CloseIcon />
            </Button>
          }
          title={
            <Text
              style={{ marginLeft: scale(24) }}
              fontFamily="Inter_700Bold"
              fontSize={18}
              numberOfLines={1}
              color={COLORS.neutral800}
            >{`${t('address.add.to.selected.group', {
              selectedGroup: collection.name
            })}`}</Text>
          }
        />
      </View>
      <Spacer value={verticalScale(24)} />
      <View style={styles.bottomSheetInput}>
        <InputWithIcon
          ref={inputRef}
          iconLeft={<SearchIcon color="#2f2b4399" />}
          iconRight={
            searchValue.length > 0 ? (
              <Button onPress={clearSearch}>
                <CloseIcon />
              </Button>
            ) : (
              <Button
                onPress={showScanner}
                disabled={selectedAddresses.length > 0}
              >
                <ScannerQRIcon />
              </Button>
            )
          }
          type="text"
          style={{ width: '65%', height: 50 }}
          placeholder={t('collection.search.public.address.placeholder')}
          placeholderTextColor="#2f2b4399"
          value={searchValue}
          onChangeText={setSearchValue}
        />
      </View>
      <Spacer value={scale(24)} />
      <BottomSheet
        height={WINDOW_HEIGHT}
        ref={scannerModalRef}
        borderRadius={0}
      >
        <BarcodeScanner onScanned={onQRCodeScanned} onClose={hideScanner} />
      </BottomSheet>
      <View style={{ paddingHorizontal: scale(24), flex: 1 }}>
        {!!searchValue ? (
          <View style={{ flex: 1 }}>
            {searchLoading && <Spinner />}
            {Boolean(searchError) && <SearchAddressNoResult />}
            {searchedAccount && (
              <View>
                <Button
                  onPress={() => {
                    handleItemPress(searchedAccount);
                  }}
                  style={styles.item}
                >
                  {searchedAccount ? (
                    <FlatList
                      contentContainerStyle={{
                        paddingBottom: 150
                      }}
                      data={[searchedAccount]}
                      renderItem={renderItem}
                      showsVerticalScrollIndicator={false}
                      ListFooterComponent={() =>
                        topHoldersLoading ? <Spinner /> : <></>
                      }
                    />
                  ) : (
                    <></>
                  )}
                </Button>
              </View>
            )}
          </View>
        ) : (
          <>
            <SegmentedPicker
              segments={AddressSources}
              selectedSegment={scrollViewIdx}
              onSelectSegment={onSelectSegment}
              styles={{
                container: {
                  paddingVertical: verticalScale(2),
                  borderRadius: moderateScale(8)
                },
                segment: {
                  selected: {
                    borderRadius: moderateScale(8),
                    paddingVertical: verticalScale(6)
                  },
                  unselected: {
                    paddingVertical: verticalScale(6)
                  }
                },
                segmentText: {
                  selected: {
                    color: COLORS.neutral800
                  },
                  unselected: {
                    color: COLORS.neutral800
                  }
                }
              }}
            />
            <Spacer value={verticalScale(24)} />
            <ScrollView
              ref={scrollRef}
              contentContainerStyle={{ flexGrow: 1 }}
              showsHorizontalScrollIndicator={false}
              horizontal
              pagingEnabled
              scrollEnabled={false}
            >
              <View style={{ width: tabWidth }}>
                <FlatList
                  contentContainerStyle={{
                    paddingBottom: 150
                  }}
                  data={topHolders}
                  renderItem={renderItem}
                  showsVerticalScrollIndicator={false}
                  onEndReachedThreshold={0.75}
                  onEndReached={loadMoreTopHolders}
                  ListFooterComponent={() =>
                    topHoldersLoading ? <Spinner /> : <></>
                  }
                />
              </View>
              <View style={{ width: tabWidth }}>
                <FlatList
                  contentContainerStyle={{
                    paddingBottom: 150
                  }}
                  data={watchlist}
                  renderItem={renderItem}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </ScrollView>
          </>
        )}
        {selectionStarted && (
          <PrimaryButton
            onPress={submitSelectedAddresses}
            style={{
              position: 'absolute',
              bottom: verticalScale(32),
              alignSelf: 'center'
            }}
          >
            <Text
              color={COLORS.neutral0}
              fontSize={16}
              fontFamily="Inter_600SemiBold"
              fontWeight="600"
            >
              {`${t(selectingAddedItems ? 'button.remove' : 'button.add')} ${t(
                'common.address',
                {
                  count: selectedAddresses.length
                }
              )}`}
            </Text>
          </PrimaryButton>
        )}
      </View>
    </BottomSheet>
  );
});
