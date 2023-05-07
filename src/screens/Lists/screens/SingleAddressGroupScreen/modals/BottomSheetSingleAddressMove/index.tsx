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

import { FlatList } from 'react-native';
import { useLists } from '@contexts/ListsContext';
import { ListOfAddressesGroupItem } from '@screens/Lists/screens/SingleAddressGroupScreen/modals/BottomSheetSingleAddressMove/ListOfAddressesGroupItem';
import { ExplorerAccount } from '@models/Explorer';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  ref: RefObject<BottomSheetRef>;
  addresses: ExplorerAccount[];
};

export const BottomSheetSingleAddressMove = forwardRef<BottomSheetRef, Props>(
  ({ addresses }, ref) => {
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
      <BottomSheet ref={localRef} isNestedSheet={false} height={850}>
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
                type="base"
                onPress={() => {
                  handleOnAddressMove(idsOfSelectedGroups, addresses);
                  localRef.current?.dismiss();
                }}
              >
                <Text
                  fontFamily="Inter_600SemiBold"
                  color={COLORS.jungleGreen}
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
              const addressesIds = addresses.map(
                (addressItem) => addressItem.address
              );
              const alreadyExistsAddresses = item.accounts.filter((account) => {
                return addressesIds.includes(account.address);
              });

              return (
                <ListOfAddressesGroupItem
                  handleOnCheckboxPress={handleOnCheckboxPress}
                  idsOfSelectedGroups={idsOfSelectedGroups}
                  item={item}
                  isAddressAlreadyInList={!!alreadyExistsAddresses.length}
                  pressedAddresses={alreadyExistsAddresses.map(
                    (address) => address.address
                  )}
                />
              );
            }}
          />
        </SafeAreaView>
      </BottomSheet>
    );
  }
);
