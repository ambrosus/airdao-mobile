import React, {
  ForwardedRef,
  forwardRef,
  RefObject,
  useCallback,
  useMemo,
  useState
} from 'react';
import {
  BottomSheet,
  BottomSheetRef,
  InputWithIcon
} from '@components/composite';
import { Button, Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { styles } from './styles';
import { BottomSheetSwiperIcon, SearchIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { Dimensions, FlatList, Platform, View } from 'react-native';
import { useLists } from '@contexts/ListsContext';
import { useWatchlist } from '@hooks';
import { scale } from '@utils/scaling';
import { WalletItem } from '@components/templates';
import { AccountList, ExplorerAccount } from '@models';
import { StringUtils } from '@utils/string';

type Props = {
  ref: RefObject<BottomSheetRef>;
  collection: AccountList;
};

export const BottomSheetAddNewAddressToGroup = forwardRef<
  BottomSheetRef,
  Props
>(({ collection }, ref) => {
  const { watchlist } = useWatchlist();
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const toggleAddressInList = useLists((v) => v.toggleAddressInList);
  const [searchValue, setSearchValue] = useState<string>('');

  const handleItemPress = useCallback(
    (item: ExplorerAccount) => {
      toggleAddressInList(item, collection);
      setTimeout(() => {
        localRef.current?.dismiss();
      }, 250);
    },
    [collection, localRef, toggleAddressInList]
  );

  const filteredAddresses = useMemo(() => {
    return watchlist.filter(
      (item) =>
        item.name.includes(searchValue) || item.address.includes(searchValue)
    );
  }, [watchlist, searchValue]);

  return (
    <BottomSheet
      ref={localRef}
      height={Dimensions.get('screen').height * 0.85}
      avoidKeyboard={false}
      containerStyle={
        Platform.OS === 'android' && {
          flex: 1,
          marginTop: Dimensions.get('screen').height * 0.05
        }
      }
    >
      <View style={{ alignItems: 'center' }}>
        <Spacer value={scale(16)} />
        <BottomSheetSwiperIcon />
        <Spacer value={scale(12)} />
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
      <Spacer value={scale(12)} />
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
      <FlatList
        contentContainerStyle={{
          paddingBottom: 150,
          paddingHorizontal: 24,
          paddingTop: 24
        }}
        data={filteredAddresses}
        renderItem={({ item }: { item: ExplorerAccount }) => {
          return (
            <Button
              onPress={() => {
                handleItemPress(item);
              }}
              style={{
                paddingVertical: 18,
                borderColor: COLORS.separator,
                borderBottomWidth: 0.2,
                borderTopWidth: 0.2
              }}
            >
              <WalletItem item={item} />
            </Button>
          );
        }}
      />
    </BottomSheet>
  );
});
