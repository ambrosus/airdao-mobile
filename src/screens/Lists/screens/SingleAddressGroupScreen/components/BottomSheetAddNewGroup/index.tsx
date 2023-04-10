import React, {
  ForwardedRef,
  forwardRef,
  RefObject,
  useCallback,
  useState
} from 'react';
import { BottomSheet, BottomSheetRef, Header } from '@components/composite';
import { Button, Input, Row, Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { styles } from './styles';
import { CloseIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { FloatButton } from '@components/base/FloatButton';
import { FlatList, View } from 'react-native';
import { ProgressArrowIcon } from '@components/svg/icons/ProgressArrow';
import { CheckBox } from '@components/base/CheckBox';
import { ListsOfAddressType } from '@appTypes/ListsOfAddressGroup';
import { randomUUID } from 'expo-crypto';
import { useLists } from '@contexts/ListsContext';

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
        <BottomSheet ref={localRef} height={500}>
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
            renderItem={({ item }) => {
              return (
                <>
                  <Spacer value={29} />
                  <View style={styles.flatListContainer}>
                    <View style={styles.whalesTokenContainer}>
                      <CheckBox
                        onPress={() => handleCheckBoxPress(item.addressId)}
                        isChecked={idsOfSelectedAddresses.includes(
                          item.addressId
                        )}
                      />
                      <View style={styles.infoContainer}>
                        <Row>
                          <Text
                            fontFamily="Inter_600SemiBold"
                            fontSize={13}
                            color={COLORS.black}
                          >
                            {item.addressTitle}
                          </Text>
                          <Text
                            fontFamily="Inter_600SemiBold"
                            fontSize={13}
                            color={COLORS.thinGrey}
                          >
                            ~ Whales list
                          </Text>
                        </Row>
                        <Spacer value={4} />
                        <Text
                          fontFamily="Mersad_600SemiBold"
                          fontSize={13}
                          color={COLORS.thinGrey}
                        >
                          {item.addressToken}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.priceProgressContainer}>
                      <View style={styles.infoContainer}>
                        <Text
                          fontFamily="Mersad_600SemiBold"
                          fontSize={13}
                          color={COLORS.black}
                        >
                          {item.addressPrice}
                        </Text>
                        <Spacer value={4} />
                        <Row justifyContent="space-between" alignItems="center">
                          <ProgressArrowIcon />
                          <Text
                            fontFamily="Mersad_600SemiBold"
                            fontSize={12}
                            color={COLORS.thinGrey}
                            style={styles.progressIcon}
                          >
                            {item.addressProgress}
                          </Text>
                        </Row>
                      </View>
                    </View>
                  </View>
                </>
              );
            }}
          />
        </BottomSheet>
      </>
    );
  }
);
