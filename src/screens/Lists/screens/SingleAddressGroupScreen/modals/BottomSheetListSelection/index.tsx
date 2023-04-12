import React, { ForwardedRef, forwardRef, RefObject, useMemo } from 'react';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Button, Row, Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks';
import { Dimensions, FlatList, SafeAreaView, View } from 'react-native';
import { styles } from '@screens/Lists/screens/SingleAddressGroupScreen/modals/BottomSheetListSelection/styles';
import { CloseIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { MoveIcon } from '@components/svg/icons/Move';
import { RemoveIcon } from '@components/svg/icons/Remove';
import AddressItem from '@screens/Lists/screens/SingleAddressGroupScreen/components/AddressItem';
import { useLists } from '@contexts/ListsContext';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamsList } from '@navigation/stacks/RootStack';

type Props = {
  ref: RefObject<BottomSheetRef>;
};

export const BottomSheetListSelection = forwardRef<BottomSheetRef, Props>(
  (props, ref) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);

    const {
      params: {
        group: { groupId }
      }
    } = useRoute<RouteProp<RootStackParamsList, 'SingleAddressGroup'>>();

    const { listsOfAddressGroup } = useLists((v) => v);

    const selectedList = useMemo(
      () =>
        listsOfAddressGroup.filter((group) => group.groupId === groupId)[0] ||
        {},
      [groupId, listsOfAddressGroup]
    );

    const { listOfAddresses } = selectedList;

    return (
      <BottomSheet ref={localRef} height={Dimensions.get('screen').height}>
        <SafeAreaView>
          <View style={styles.header}>
            <Row alignItems="center" justifyContent="space-between">
              <Button type="base" onPress={() => localRef.current?.dismiss()}>
                <CloseIcon />
              </Button>
              <Text
                fontFamily="Inter_600SemiBold"
                fontSize={15}
                color={COLORS.black}
              >
                selected
              </Text>
              <Text
                fontFamily="Inter_500Medium"
                fontSize={12}
                color="#2f2b4399"
              >
                total price
              </Text>
              <Button>
                <MoveIcon />
              </Button>
              <Button>
                <RemoveIcon />
              </Button>
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
              return <AddressItem item={item} />;
            }}
          />
        </SafeAreaView>
      </BottomSheet>
    );
  }
);
