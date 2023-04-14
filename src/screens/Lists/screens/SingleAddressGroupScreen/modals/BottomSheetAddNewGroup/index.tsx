import React, {
  ForwardedRef,
  forwardRef,
  RefObject,
  useCallback,
  useState
} from 'react';
import { BottomSheet, BottomSheetRef, Header } from '@components/composite';
import { Button, Input, Text } from '@components/base';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { styles } from './styles';
import { CloseIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { FloatButton } from '@components/base/FloatButton';
import { FlatList } from 'react-native';
import { ListsOfAddressType } from '@appTypes/ListsOfAddressGroup';
import { randomUUID } from 'expo-crypto';
import { useLists } from '@contexts/ListsContext';
import { AddressItemWithCheckbox } from './components/AddressItem';

type Props = {
  ref: RefObject<BottomSheetRef>;
  groupId: string;
};

const mockedAddresses: ListsOfAddressType[] = [
  {
    addressTitle: 'address 01',
    addressPrice: '$45,000',
    addressToken: '20 AMB',
    addressProgress: '3.46%',
    addressId: randomUUID()
  },
  {
    addressTitle: 'address 02',
    addressPrice: '$12,000',
    addressToken: '341 AMB',
    addressProgress: '1222.46%',
    addressId: randomUUID()
  },
  {
    addressTitle: 'address 03',
    addressPrice: '$188,000',
    addressToken: '78 AMB',
    addressProgress: '22.9%',
    addressId: randomUUID()
  },
  {
    addressTitle: 'address 04',
    addressPrice: '$5,872',
    addressToken: '200 AMB',
    addressProgress: '4.56%',
    addressId: randomUUID()
  }
];

export const BottomSheetAddNewGroup = forwardRef<BottomSheetRef, Props>(
  ({ groupId }, ref) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
    const handleOnAddNewAddresses = useLists((v) => v.handleOnAddNewAddresses);
    const [idsOfSelectedAddresses, setIdsOfSelectedAddresses] = useState<
      string[]
    >([]);

    const handleOnAddNewAddress = useCallback(() => {
      const selectedAddressesForGroup = mockedAddresses.filter((item) =>
        idsOfSelectedAddresses.includes(item.addressId)
      );
      handleOnAddNewAddresses(selectedAddressesForGroup, groupId);
      localRef.current?.dismiss();
    }, [groupId, handleOnAddNewAddresses, idsOfSelectedAddresses, localRef]);

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
                <CloseIcon />
              </Button>
            }
            contentRight={
              <Button type="base" onPress={handleOnAddNewAddress}>
                <Text
                  fontFamily="Inter_600SemiBold"
                  color={COLORS.lightGrey}
                  fontSize={16}
                >
                  Add to list
                </Text>
              </Button>
            }
          />
          <Input
            type="text"
            placeholder="Search watchlist"
            placeholderTextColor="#2f2b4399"
            style={[styles.bottomSheetInput]}
            value=""
            onChangeValue={() => null}
          />
          <FloatButton
            title="Track new Address"
            bottomPadding={0}
            onPress={() => null}
          />
          <FlatList
            contentContainerStyle={{
              paddingBottom: 150
            }}
            data={mockedAddresses}
            renderItem={({ item }) => (
              <AddressItemWithCheckbox
                item={item}
                handleCheckBoxPress={handleCheckBoxPress}
                idsOfSelectedAddresses={idsOfSelectedAddresses}
              />
            )}
          />
        </BottomSheet>
      </>
    );
  }
);
