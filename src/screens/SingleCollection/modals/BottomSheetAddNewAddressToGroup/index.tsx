import React, {
  ForwardedRef,
  forwardRef,
  RefObject,
  useCallback,
  useMemo,
  useState
} from 'react';
import { Dimensions, FlatList, ListRenderItemInfo, View } from 'react-native';
import {
  BottomSheet,
  BottomSheetRef,
  InputWithIcon,
  Segment,
  SegmentedPicker
} from '@components/composite';
import { Button, Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { SearchIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { useLists } from '@contexts/ListsContext';
import { useWatchlist } from '@hooks';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { WalletItem } from '@components/templates';
import { AccountList, ExplorerAccount } from '@models';
import { StringUtils } from '@utils/string';
import { styles } from './styles';

type Props = {
  ref: RefObject<BottomSheetRef>;
  collection: AccountList;
};

const AddressSources: Segment[] = [
  {
    title: 'Top Holders',
    value: 0,
    id: '1'
  },
  {
    title: 'Watchlist',
    value: 1,
    id: '2'
  }
];

export const BottomSheetAddNewAddressToGroup = forwardRef<
  BottomSheetRef,
  Props
>(({ collection }, ref) => {
  const { watchlist } = useWatchlist();
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const toggleAddressInList = useLists((v) => v.toggleAddressInList);
  const [searchValue, setSearchValue] = useState<string>('');
  const [scrollViewIdx, setScrollViewIdx] = useState(0);

  const handleItemPress = useCallback(
    (item: ExplorerAccount) => {
      toggleAddressInList(item, collection);
      setTimeout(() => {
        localRef.current?.dismiss();
      }, 400);
    },
    [collection, localRef, toggleAddressInList]
  );

  const filteredAddresses = useMemo(() => {
    return watchlist.filter(
      (item) =>
        item.name.includes(searchValue) || item.address.includes(searchValue)
    );
  }, [watchlist, searchValue]);

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
          iconLeft={<SearchIcon color="#2f2b4399" />}
          type="text"
          style={{ width: '65%', height: 50 }}
          placeholder="Search public address"
          placeholderTextColor="#2f2b4399"
          value={searchValue}
          onChangeValue={setSearchValue}
        />
      </View>
      <Spacer value={scale(24)} />
      <SegmentedPicker
        segments={AddressSources}
        selectedSegment={
          AddressSources.find((s) => s.value === scrollViewIdx)?.id ||
          AddressSources[0].id
        }
        onSelectSegment={(selectedSegment) =>
          setScrollViewIdx(selectedSegment.value as number)
        }
        styles={{
          container: {
            paddingVertical: verticalScale(2),
            borderRadius: moderateScale(8)
          },
          segment: {
            selected: {
              borderRadius: moderateScale(8)
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
      <FlatList
        contentContainerStyle={{
          paddingBottom: 150,
          paddingTop: verticalScale(24)
        }}
        data={filteredAddresses}
        renderItem={renderItem}
      />
    </BottomSheet>
  );
});
