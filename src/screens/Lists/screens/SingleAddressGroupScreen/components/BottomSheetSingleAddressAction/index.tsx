import React, {
  ForwardedRef,
  forwardRef,
  RefObject,
  useMemo,
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
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamsList } from '@navigation/stacks/RootStack';
import { CheckBox } from '@components/base/CheckBox';

type Props = {
  ref: RefObject<BottomSheetRef>;
  addressGroupId: string;
  addressTitle: string;
};

export const BottomSheetSingleAddressAction = forwardRef<BottomSheetRef, Props>(
  ({ addressTitle }, ref) => {
    const {
      params: {
        group: { groupId }
      }
    } = useRoute<RouteProp<RootStackParamsList, 'SingleAddressGroup'>>();

    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);

    const { listsOfAddressGroup } = useLists((v) => v);
    const idOfSelectedAddressGroup = useMemo(() => {
      return listsOfAddressGroup.filter((item) => {
        return item.groupId === groupId;
      })[0].groupId;
    }, [listsOfAddressGroup, groupId]);

    const [toggleCheckBox, setToggleCheckBox] = useState(false);

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
            <Button type="base" onPress={() => localRef.current?.dismiss()}>
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
                      {idOfSelectedAddressGroup === item.groupId
                        ? `${addressTitle} is already on this list`
                        : `${item.addressesCount} Addresses`}
                    </Text>
                  </View>
                </View>
                <CheckBox
                  onPress={() => setToggleCheckBox(!toggleCheckBox)}
                  isChecked={toggleCheckBox}
                />
              </View>
            );
          }}
        />
      </BottomSheet>
    );
  }
);
