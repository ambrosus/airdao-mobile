import React, {
  ForwardedRef,
  forwardRef,
  RefObject,
  useCallback,
  useState
} from 'react';
import { BottomSheet, BottomSheetRef, Header } from '@components/composite';
import { Button, Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { styles } from '@screens/Lists/screens/SingleAddressGroupScreen/components/BottomSheetSingleAddressAction/styles';
import { CloseIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { FlatList, View } from 'react-native';
import { useLists } from '@contexts/ListsContext';
import { CheckBox } from '@components/base/CheckBox';
import { ListsOfAddressType } from '@appTypes/ListsOfAddressGroup';

type Props = {
  ref: RefObject<BottomSheetRef>;
  address: ListsOfAddressType;
};

export const BottomSheetSingleAddressAction = forwardRef<BottomSheetRef, Props>(
  ({ address: pressedAddress }, ref) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
    const { listsOfAddressGroup, handleOnAddressMove } = useLists((v) => v);

    const [idsOfSelectedGroups, setIdsOfSelectedGroups] = useState<string[]>(
      []
    );

    const handleOnCheckboxPress = useCallback(
      (selectedAddressId: string) => {
        if (idsOfSelectedGroups.includes(selectedAddressId)) {
          setIdsOfSelectedGroups(
            idsOfSelectedGroups.filter((elem) => elem !== selectedAddressId)
          );
        } else {
          setIdsOfSelectedGroups((curr) => [...curr, selectedAddressId]);
        }
      },
      [idsOfSelectedGroups]
    );

    return (
      <BottomSheet height={850} ref={localRef}>
        <Header
          style={styles.header}
          title="Move to another list"
          titlePosition="center"
          backIconVisible={false}
          contentLeft={
            <Button type="base" onPress={() => localRef.current?.dismiss()}>
              <CloseIcon />
            </Button>
          }
          contentRight={
            <Button
              disabled={!idsOfSelectedGroups.length}
              type="base"
              onPress={() => {
                handleOnAddressMove(idsOfSelectedGroups, pressedAddress);
                localRef.current?.dismiss();
              }}
            >
              <Text
                fontFamily="Inter_600SemiBold"
                color={COLORS.black}
                fontSize={16}
              >
                Move
              </Text>
            </Button>
          }
        />
        <FlatList
          contentContainerStyle={{
            paddingBottom: 150
          }}
          data={listsOfAddressGroup}
          renderItem={({ item }) => {
            const isAddressAlreadyInList = item.listOfAddresses.some(
              (address) => address.addressId === pressedAddress.addressId
            );
            return (
              <View style={styles.container}>
                <View style={styles.itemInfo}>
                  <Text
                    fontFamily="Inter_600SemiBold"
                    fontSize={17}
                    color={COLORS.black}
                    style={styles.itemTitle}
                  >
                    {item.groupTitle}
                  </Text>
                  <Spacer value={4} />
                  <View style={styles.itemSubInfo}>
                    <Text fontFamily="Inter_400Regular" fontSize={16}>
                      {isAddressAlreadyInList
                        ? `${pressedAddress.addressTitle} is already on this list`
                        : `${item.addressesCount} Addresses`}
                    </Text>
                  </View>
                </View>
                <CheckBox
                  onPress={() => {
                    if (!isAddressAlreadyInList)
                      handleOnCheckboxPress(item.groupId);
                  }}
                  isChecked={
                    isAddressAlreadyInList ||
                    idsOfSelectedGroups.includes(item.groupId)
                  }
                />
              </View>
            );
          }}
        />
      </BottomSheet>
    );
  }
);
