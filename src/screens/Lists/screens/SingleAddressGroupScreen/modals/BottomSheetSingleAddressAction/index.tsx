import React, {
  ForwardedRef,
  forwardRef,
  RefObject,
  useCallback,
  useState
} from 'react';
import { BottomSheet, BottomSheetRef, Header } from '@components/composite';
import { Button, Text } from '@components/base';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { CloseIcon } from '@components/svg/icons';
import { styles } from './styles';
import { COLORS } from '@constants/colors';
import { FlatList, SafeAreaView } from 'react-native';
import { useLists } from '@contexts/ListsContext';
import { ListsOfAddressType } from '@appTypes/ListsOfAddressGroup';
import { ListOfAddressesGroupItem } from '@screens/Lists/screens/SingleAddressGroupScreen/modals/BottomSheetSingleAddressAction/ListOfAddressesGroupItem';

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
      <BottomSheet ref={localRef} isNestedSheet={true} height={850}>
        <SafeAreaView>
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
                <ListOfAddressesGroupItem
                  handleOnCheckboxPress={handleOnCheckboxPress}
                  idsOfSelectedGroups={idsOfSelectedGroups}
                  item={item}
                  isAddressAlreadyInList={isAddressAlreadyInList}
                  pressedAddress={pressedAddress}
                />
              );
            }}
          />
        </SafeAreaView>
      </BottomSheet>
    );
  }
);
