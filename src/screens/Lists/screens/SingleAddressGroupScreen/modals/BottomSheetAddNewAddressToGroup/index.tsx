import React, {
  ForwardedRef,
  forwardRef,
  RefObject,
  useCallback,
  useState
} from 'react';
import { BottomSheet, BottomSheetRef, Header } from '@components/composite';
import { Button, Input, Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { styles } from './styles';
import { BackIcon, CloseIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { FlatList, Platform, View } from 'react-native';
import { useLists } from '@contexts/ListsContext';
import { AddressItemWithCheckbox } from './components/AddressItemWithCheckbox';
import { useWatchlist } from '@hooks';

type Props = {
  ref: RefObject<BottomSheetRef>;
  groupId: string;
};

export const BottomSheetAddNewAddressToGroup = forwardRef<
  BottomSheetRef,
  Props
>(({ groupId }, ref) => {
  const { watchlist } = useWatchlist();
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const handleOnAddNewAddresses = useLists((v) => v.handleOnAddNewAddresses);
  const [idsOfSelectedAddresses, setIdsOfSelectedAddresses] = useState<
    string[]
  >([]);

  const handleOnAddNewAddress = useCallback(() => {
    const selectedAddressesForGroup = watchlist.filter((item) =>
      idsOfSelectedAddresses.includes(item.address)
    );
    handleOnAddNewAddresses(selectedAddressesForGroup, groupId);
    localRef.current?.dismiss();
  }, [
    groupId,
    handleOnAddNewAddresses,
    idsOfSelectedAddresses,
    localRef,
    watchlist
  ]);

  const handleCheckBoxPress = useCallback(
    (id: string) => {
      if (!idsOfSelectedAddresses.includes(id)) {
        setIdsOfSelectedAddresses([...idsOfSelectedAddresses, id]);
      } else {
        const selectedAddresses = idsOfSelectedAddresses.filter(
          (i) => i !== id
        );
        setIdsOfSelectedAddresses(selectedAddresses);
      }
    },
    [idsOfSelectedAddresses]
  );

  return (
    <>
      <BottomSheet ref={localRef} height={800}>
        <Header
          title="Add from watchlists"
          titlePosition="center"
          style={styles.header}
          backIconVisible={false}
          contentLeft={
            <Button
              type="base"
              onPress={() => {
                localRef.current?.dismiss();
              }}
            >
              {Platform.OS === 'ios' ? <CloseIcon /> : <BackIcon />}
            </Button>
          }
          contentRight={
            Platform.OS === 'ios' && (
              <Button type="base" onPress={handleOnAddNewAddress}>
                <Text
                  fontFamily="Inter_600SemiBold"
                  color={COLORS.jungleGreen}
                  fontSize={16}
                >
                  Add to list
                </Text>
              </Button>
            )
          }
        />
        <Input
          type="text"
          placeholder="Search watchlist"
          placeholderTextColor="#2f2b4399"
          style={styles.bottomSheetInput}
          value=""
          onChangeValue={() => null}
        />
        <FlatList
          contentContainerStyle={{
            paddingBottom: 150
          }}
          data={watchlist}
          renderItem={({ item }) => (
            <AddressItemWithCheckbox
              item={item}
              handleCheckBoxPress={handleCheckBoxPress}
              idsOfSelectedAddresses={idsOfSelectedAddresses}
            />
          )}
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
          <Spacer value={20} />
          <Button
            style={
              Platform.OS === 'ios'
                ? styles.bottomAddToListButton
                : styles.bottomTrackNewAddressButton
            }
            onPress={() => null}
          >
            <Text
              style={
                Platform.OS === 'ios'
                  ? styles.bottomAddToListButtonText
                  : styles.bottomTrackNewAddressButtonText
              }
            >
              Track new Address
            </Text>
          </Button>
          <Spacer value={24} />
        </View>
      </BottomSheet>
    </>
  );
});
