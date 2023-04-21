import React, {
  ForwardedRef,
  forwardRef,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Button, Row, Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks';
import { Dimensions, FlatList, SafeAreaView, View } from 'react-native';
import { styles } from '@screens/Lists/screens/SingleAddressGroupScreen/modals/BottomSheetLongPressAddressSelection/styles';
import { CloseIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { MoveIcon } from '@components/svg/icons/Move';
import { RemoveIcon } from '@components/svg/icons/Remove';
import { useLists } from '@contexts/ListsContext';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamsList } from '@navigation/stacks/RootStack';
import { CheckBox } from '@components/base/CheckBox';
import { BottomSheetSingleAddressMove } from '@screens/Lists/screens/SingleAddressGroupScreen/modals/BottomSheetSingleAddressMove';
import { ExplorerAccount } from '@models/Explorer';
import { WalletItem } from '@components/templates';

type Props = {
  ref: RefObject<BottomSheetRef>;
  address?: ExplorerAccount;
};

export const BottomSheetLongPressAddressSelection = forwardRef<
  BottomSheetRef,
  Props
>(({ address }, ref) => {
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const actionRef = useRef<BottomSheetRef>(null);
  const { listsOfAddressGroup, handleOnDeleteAddressFromGroup } = useLists(
    (v) => v
  );
  const {
    params: {
      group: { id: groupId }
    }
  } = useRoute<RouteProp<RootStackParamsList, 'SingleAddressGroup'>>();

  const selectedList = useMemo(
    () => listsOfAddressGroup.filter((group) => group.id === groupId)[0] || {},
    [groupId, listsOfAddressGroup]
  );

  const { accounts: listOfAddresses } = selectedList;

  const [idsOfSelectedAddresses, setIdsOfSelectedAddresses] = useState<
    string[]
  >([]);

  const handleCheckBoxPress = useCallback(
    (id: string) => {
      if (!idsOfSelectedAddresses.includes(id)) {
        setIdsOfSelectedAddresses([...idsOfSelectedAddresses, id]);
      } else {
        // tslint:disable-next-line:no-shadowed-variable
        const selectedAddresses = idsOfSelectedAddresses.filter(
          (i) => i !== id
        );
        setIdsOfSelectedAddresses(selectedAddresses);
      }
    },
    [idsOfSelectedAddresses]
  );

  const handleOpenSingleAddressAction = useCallback(() => {
    actionRef.current?.show();
  }, []);

  const handleDeleteAddress = () => {
    handleOnDeleteAddressFromGroup(groupId, idsOfSelectedAddresses);
    setIdsOfSelectedAddresses([]);
  };

  useEffect(() => {
    if (address?.address) {
      setIdsOfSelectedAddresses([address.address]);
    }
  }, [address?.address]);

  const selectedAddresses = useMemo(() => {
    return listOfAddresses?.filter((addressItem) =>
      idsOfSelectedAddresses.includes(addressItem.address)
    );
  }, [idsOfSelectedAddresses, listOfAddresses]);
  return (
    <BottomSheet ref={localRef} height={Dimensions.get('screen').height}>
      <SafeAreaView>
        <View style={styles.header}>
          <Row alignItems="center" justifyContent="space-between">
            <Row alignItems="center">
              <Button
                style={{ paddingRight: 20 }}
                type="base"
                onPress={() => localRef.current?.dismiss()}
              >
                <CloseIcon />
              </Button>
              <Text
                style={{ paddingRight: 8 }}
                fontFamily="Inter_600SemiBold"
                fontSize={15}
                color={COLORS.black}
              >
                {idsOfSelectedAddresses.length} selected
              </Text>
              <Text
                fontFamily="Inter_500Medium"
                fontSize={12}
                color="#2f2b4399"
              >
                total price
              </Text>
            </Row>
            <Row alignItems="center">
              <Button
                onPress={handleOpenSingleAddressAction}
                style={{ paddingRight: 29 }}
              >
                <MoveIcon />
              </Button>
              <Button onPress={handleDeleteAddress}>
                <RemoveIcon />
              </Button>
            </Row>
          </Row>
        </View>
        <Spacer value={34} />
        <FlatList
          contentContainerStyle={{
            paddingBottom: 150
          }}
          style={styles.flatListContainer}
          data={listOfAddresses}
          renderItem={({ item }) => {
            return (
              <Row
                style={{ flex: 1, paddingBottom: 32 }}
                justifyContent="space-between"
              >
                <View style={{ paddingRight: 16 }}>
                  <CheckBox
                    onPress={() => {
                      handleCheckBoxPress(item.address);
                    }}
                    isChecked={idsOfSelectedAddresses.includes(item.address)}
                  />
                </View>
                <WalletItem item={item} />
              </Row>
            );
          }}
        />
      </SafeAreaView>
      <BottomSheetSingleAddressMove
        ref={actionRef}
        addresses={selectedAddresses}
      />
    </BottomSheet>
  );
});
