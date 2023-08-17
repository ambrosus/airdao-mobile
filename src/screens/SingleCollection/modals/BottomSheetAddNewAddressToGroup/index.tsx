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
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  ScrollView,
  View,
  useWindowDimensions
} from 'react-native';
import { SearchAddressNoResult } from '@components/templates/SearchAddress/SearchAddress.NoMatch';
import {
  BottomSheet,
  BottomSheetRef,
  CheckBox,
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
import { BarcodeScanner, WalletItem } from '@components/templates';
import { AccountList, ExplorerAccount } from '@models';
import { StringUtils } from '@utils/string';
import { SearchSort } from '@screens/Search/Search.types';
import { etherumAddressRegex } from '@constants/regex';
import { styles } from './styles';

type Props = {
  ref: RefObject<BottomSheetRef>;
  collection: AccountList;
};

const AddressSources: Segment[] = [
  {
    title: 'Watchlist',
    value: 0,
    id: 'watchlist'
  },
  {
    title: 'Top Holders',
    value: 1,
    id: 'topHolders'
  }
];

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
  >('watchlist');
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
    setScrollViewIdx('watchlist');
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
                fillColor={COLORS.blue500}
                color={COLORS.white}
                type="square"
                value={selected}
              />
              <Spacer horizontal value={scale(16)} />
            </Row>
          )}
          <View style={{ flex: 1 }}>
            <WalletItem item={item} indicatorVisible={true} />
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
      Alert.alert('Invalid QR code', '', [
        {
          text: 'Scan again',
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
    setScrollViewIdx('watchlist');
  };

  return (
    <BottomSheet
      ref={localRef}
      height={Dimensions.get('window').height * 0.85}
      avoidKeyboard={false}
      swiperIconVisible={true}
      containerStyle={{
        paddingHorizontal: scale(24)
      }}
      onClose={resetState}
    >
      <View
        style={{ alignItems: 'center' }}
        testID="bottom-sheet-add-new-address"
      >
        <Spacer value={verticalScale(24)} />
        <Text
          fontFamily="Inter_700Bold"
          fontSize={18}
          color={COLORS.nero}
        >{`Add address to ${StringUtils.formatAddress(
          collection.name,
          10,
          0
        )}`}</Text>
      </View>
      <Spacer value={verticalScale(24)} />
      <View style={styles.bottomSheetInput}>
        <InputWithIcon
          editable={selectedAddresses.length === 0}
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
          placeholder="Search public address"
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
                <WalletItem item={searchedAccount} indicatorVisible={true} />
              </Button>
            </View>
          )}
        </View>
      ) : (
        <>
          <SegmentedPicker
            disabled={selectionStarted}
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
                data={watchlist}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
              />
            </View>
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
            color={COLORS.white}
            fontSize={16}
            fontFamily="Inter_600SemiBold"
            fontWeight="600"
          >
            {selectingAddedItems
              ? `Remove ${StringUtils.pluralize(
                  selectedAddresses.length,
                  'Address',
                  'Addresses'
                )}`
              : `Add ${StringUtils.pluralize(
                  selectedAddresses.length,
                  'Address',
                  'Addresses'
                )}`}
          </Text>
        </PrimaryButton>
      )}
    </BottomSheet>
  );
});
