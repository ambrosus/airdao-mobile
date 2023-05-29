import React, { ForwardedRef, forwardRef, RefObject, useCallback } from 'react';
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
import { Dimensions, FlatList, View } from 'react-native';
import { useLists } from '@contexts/ListsContext';
import { useWatchlist } from '@hooks';
import { scale } from '@utils/scaling';
import { WalletItem } from '@components/templates';
import { AccountList, ExplorerAccount } from '@models';

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

  const handleItemPress = useCallback(
    (item: ExplorerAccount) => {
      toggleAddressInList(item, collection);
      localRef.current?.dismiss();
    },
    [collection, localRef, toggleAddressInList]
  );

  return (
    <BottomSheet ref={localRef} height={Dimensions.get('screen').height * 0.85}>
      <View style={{ alignItems: 'center' }}>
        <Spacer value={scale(16)} />
        <BottomSheetSwiperIcon />
        <Spacer value={scale(12)} />
        <Text
          fontFamily="Inter_700Bold"
          fontSize={18}
          color={COLORS.nero}
        >{`Add address to ${collection.name}`}</Text>
      </View>
      <Spacer value={scale(12)} />
      <View style={styles.bottomSheetInput}>
        <InputWithIcon
          iconLeft={<SearchIcon color="#2f2b4399" />}
          type="text"
          style={{ width: '65%', height: 50 }}
          placeholder="Search watchlist"
          placeholderTextColor="#2f2b4399"
          value=""
          onChangeValue={() => null}
        />
      </View>
      <FlatList
        contentContainerStyle={{
          paddingBottom: 150,
          paddingHorizontal: 24,
          paddingTop: 24
        }}
        data={watchlist}
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
