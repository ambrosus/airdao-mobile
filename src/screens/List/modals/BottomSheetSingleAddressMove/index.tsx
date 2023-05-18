import React, {
  ForwardedRef,
  forwardRef,
  RefObject,
  useCallback,
  useState
} from 'react';
import {
  BottomSheet,
  BottomSheetRef,
  Header,
  InputWithIcon
} from '@components/composite';
import { Button, Text } from '@components/base';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { CloseIcon, SearchIcon } from '@components/svg/icons';
import { styles } from './styles';
import { COLORS } from '@constants/colors';

import { FlatList, View } from 'react-native';
import { useLists } from '@contexts/ListsContext';
import { ListOfAddressesGroupItem } from '@screens/List/modals/BottomSheetSingleAddressMove/ListOfAddressesGroupItem';
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
      <BottomSheet ref={localRef} isNestedSheet height={800}>
        <SafeAreaView>
          <Header
            style={styles.header}
            title={
              <Text
                fontFamily="Inter_700Bold"
                fontSize={18}
                color={COLORS.nero}
              >
                Move address to collection
              </Text>
            }
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
          <View style={{ borderRadius: 25, paddingHorizontal: 16 }}>
            <InputWithIcon
              iconLeft={<SearchIcon color="#2f2b4399" />}
              type="text"
              style={{ width: '65%', height: 50 }}
              placeholder="Search collections"
              placeholderTextColor="#2f2b4399"
              value=""
              onChangeValue={() => null}
            />
          </View>
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
