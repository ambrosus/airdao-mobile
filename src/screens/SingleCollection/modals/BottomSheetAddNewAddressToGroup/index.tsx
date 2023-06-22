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
import {
  BottomSheet,
  BottomSheetRef,
  InputWithIcon,
  Segment,
  SegmentedPicker
} from '@components/composite';
import { Button, InputRef, Spacer, Spinner, Text } from '@components/base';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { ScannerQRIcon, SearchIcon } from '@components/svg/icons';
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
  const toggleAddressInList = useLists((v) => v.toggleAddressInList);
  const [scrollViewIdx, setScrollViewIdx] = useState<
    'watchlist' | 'topHolders'
  >('watchlist');
  const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = useWindowDimensions();
  const tabWidth = WINDOW_WIDTH - scale(48);

  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<InputRef>(null);
  const scannerModalRef = useRef<BottomSheetRef>(null);
  const scanned = useRef(false);

  const handleItemPress = useCallback(
    (item: ExplorerAccount) => {
      toggleAddressInList(item, collection);
      setTimeout(() => {
        setScrollViewIdx('watchlist');
        localRef.current?.dismiss();
      }, 400);
    },
    [collection, localRef, toggleAddressInList]
  );

  const renderItem = (
    args: ListRenderItemInfo<ExplorerAccount>
  ): JSX.Element => {
    const { item } = args;
    return (
      <Button
        onPress={() => {
          handleItemPress(item);
        }}
        style={styles.item}
      >
        <WalletItem item={item} indicatorVisible={true} />
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
      Alert.alert('Invalid QR Code', '', [
        {
          text: 'Scan Again',
          onPress: () => {
            scanned.current = false;
          }
        }
      ]);
    }
  };

  return (
    <BottomSheet
      ref={localRef}
      height={Dimensions.get('screen').height * 0.85}
      avoidKeyboard={false}
      swiperIconVisible={true}
      containerStyle={{
        paddingHorizontal: scale(24)
      }}
    >
      <View style={{ alignItems: 'center' }}>
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
          ref={inputRef}
          iconLeft={<SearchIcon color="#2f2b4399" />}
          iconRight={
            <Button onPress={showScanner}>
              <ScannerQRIcon />
            </Button>
          }
          type="text"
          style={{ width: '65%', height: 50 }}
          placeholder="Search public address"
          placeholderTextColor="#2f2b4399"
          value={searchValue}
          onChangeValue={setSearchValue}
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
        <View>
          {searchLoading && <Spinner />}
          {Boolean(searchError) && <View>Could not find address</View>}
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
                  paddingBottom: 150,
                  paddingTop: verticalScale(24)
                }}
                data={watchlist}
                renderItem={renderItem}
              />
            </View>
            <View style={{ width: tabWidth }}>
              <FlatList
                contentContainerStyle={{
                  paddingBottom: 150,
                  paddingTop: verticalScale(24)
                }}
                data={topHolders}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => (
                  <Spacer value={verticalScale(26)} />
                )}
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
    </BottomSheet>
  );
});
