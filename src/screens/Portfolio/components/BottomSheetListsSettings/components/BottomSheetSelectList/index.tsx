import React, { ForwardedRef, forwardRef, RefObject, useState } from 'react';
import { Button, Row, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { BottomSheet, CheckBox } from '@components/composite';
import { CloseIcon } from '@components/svg/icons/Close';
import { COLORS } from '@constants/colors';
import { FlatList, View } from 'react-native';
import { ListsSettingsSelectList } from '@screens/Portfolio/components/BottomSheetListsSettings/components/BottomSheetSelectList/components/ListsSettingsSelectList';
import { Spacer } from '@components/base/Spacer';
import { styles } from '@screens/Portfolio/components/BottomSheetListsSettings/components/BottomSheetSelectList/styles';

type Props = {
  ref: RefObject<BottomSheetRef>;
};

const mockedData = [
  {
    title: 'Whales',
    wallets: '5 wallets'
  },
  {
    title: 'Whales',
    wallets: '5 wallets'
  },
  {
    title: 'Whales',
    wallets: '5 wallets'
  }
];

export const BottomSheetSelectList = forwardRef<BottomSheetRef, Props>(
  (props, ref) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
    const [toggleCheckBox, setToggleCheckBox] = useState(false);
    return (
      <BottomSheet height={800} ref={localRef} isNestedSheet>
        <View style={styles.container}>
          <Row justifyContent="space-between" alignItems="center">
            <Button type="base" onPress={() => localRef.current?.dismiss()}>
              <View style={{ width: 38 }}>
                <CloseIcon />
              </View>
            </Button>
            <Text
              fontFamily="Inter_600SemiBold"
              fontSize={15}
              color={COLORS.smokyBlack}
            >
              Select lists
            </Text>
            <Button type="base" onPress={() => localRef.current?.dismiss()}>
              <Text
                fontFamily="Inter_600SemiBold"
                color={COLORS.lightGrey}
                fontSize={16}
              >
                Save
              </Text>
            </Button>
          </Row>
          <Spacer value={45} />
          <View style={styles.infoContainer}>
            <Text
              fontFamily="Inter_600SemiBold"
              fontSize={17}
              color={COLORS.smokyBlack}
            >
              All
            </Text>
            <CheckBox
              onValueChange={() => setToggleCheckBox(!toggleCheckBox)}
              type="square"
              fillColor={COLORS.sapphireBlue}
              color={COLORS.white}
              value={toggleCheckBox}
            />
          </View>
          <View style={styles.walletsContainer}>
            <FlatList
              contentContainerStyle={{
                paddingBottom: 150
              }}
              data={mockedData}
              renderItem={({ item, index }) => {
                return <ListsSettingsSelectList key={index} item={item} />;
              }}
            />
          </View>
        </View>
      </BottomSheet>
    );
  }
);
