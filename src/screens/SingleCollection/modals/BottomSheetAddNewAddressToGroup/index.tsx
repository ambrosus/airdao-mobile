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
  Header,
  InputWithIcon
} from '@components/composite';
import { Button, Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { styles } from './styles';
import { SearchIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { Dimensions, FlatList, Platform, View } from 'react-native';
import { useLists } from '@contexts/ListsContext';
import { useWatchlist } from '@hooks';
import { scale, verticalScale } from '@utils/scaling';
import { WalletItem } from '@components/templates';
import { ExplorerAccount } from '@models';

type Props = {
  ref: RefObject<BottomSheetRef>;
  groupId: string;
  groupName?: string;
  isFirstItem?: string;
};

export const BottomSheetAddNewAddressToGroup = forwardRef<
  BottomSheetRef,
  Props
>(({ groupId, groupName, isFirstItem }, ref) => {
  const { watchlist } = useWatchlist();
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const handleOnAddNewAddresses = useLists((v) => v.handleOnAddNewAddresses);
  const [idsOfSelectedAddresses, setIdsOfSelectedAddresses] = useState<
    string[]
  >([]);

  const handleItemPress = useCallback(
    (id: string) => {
      if (!idsOfSelectedAddresses.includes(id)) {
        setIdsOfSelectedAddresses([...idsOfSelectedAddresses, id]);
        const ids = [...idsOfSelectedAddresses, id];
        const selectedAddressesForGroup = watchlist.filter((item) =>
          ids.includes(item._id)
        );
        handleOnAddNewAddresses(selectedAddressesForGroup, groupId);
      } else {
        const selectedAddresses = idsOfSelectedAddresses.filter(
          (i) => i !== id
        );
        setIdsOfSelectedAddresses(selectedAddresses);
        const selectedAddressesForGroup = watchlist.filter((item) =>
          selectedAddresses.includes(item._id)
        );
        handleOnAddNewAddresses(selectedAddressesForGroup, groupId);
      }
      localRef.current?.dismiss();
    },
    [
      groupId,
      handleOnAddNewAddresses,
      idsOfSelectedAddresses,
      localRef,
      watchlist
    ]
  );

  const stylesForFirstItem = useMemo(() => {
    return { marginTop: verticalScale(20), borderBottomWidth: 0 };
  }, []);

  return (
    <>
      <BottomSheet
        ref={localRef}
        height={Platform.OS === 'ios' ? 800 : Dimensions.get('screen').height}
      >
        {Platform.OS === 'android' && <Spacer value={scale(57)} />}
        <Header
          titleStyle={styles.headerTitle}
          title={
            <Text
              fontFamily="Inter_700Bold"
              fontSize={18}
              color={COLORS.nero}
            >{`Add address to ${groupName}`}</Text>
          }
          titlePosition="center"
          style={styles.header}
          backIconVisible={false}
        />
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
                  handleItemPress(item._id);
                }}
                style={[
                  {
                    paddingVertical: 18,
                    borderColor: COLORS.thinGrey,
                    borderBottomWidth: 0.2,
                    borderTopWidth: 0.2
                  },
                  isFirstItem && stylesForFirstItem
                ]}
              >
                <WalletItem item={item} />
              </Button>
            );
          }}
        />
        <View style={styles.bottomButtons}>
          {Platform.OS === 'android' && (
            <Button
              style={styles.bottomAddToListButton}
              onPress={handleOnAddNewAddress}
            >
              <Text style={styles.bottomAddToListButtonText}>Add to list</Text>
            </Button>
          )}
        </View>
      </BottomSheet>
    </>
  );
});
