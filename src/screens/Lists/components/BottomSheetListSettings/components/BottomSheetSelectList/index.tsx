import React, { ForwardedRef, forwardRef, RefObject } from 'react';
import { Button, Row, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { BottomSheet } from '@components/composite';
import { CloseIcon } from '@components/svg/icons/Close';
import { COLORS } from '@constants/colors';
import { StyleSheet, View } from 'react-native';

type Props = {
  ref: RefObject<BottomSheetRef>;
};
export const BottomSheetSelectList = forwardRef<BottomSheetRef, Props>(
  (props, ref) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
    return (
      <BottomSheet height={800} ref={localRef}>
        <View style={styles.container}>
          <Row justifyContent="space-between" alignItems="center">
            <Button type="base" onPress={() => localRef.current?.dismiss()}>
              <CloseIcon />
            </Button>
            <Text
              fontFamily="Inter_600SemiBold"
              fontSize={15}
              color={COLORS.black}
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
        </View>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingLeft: 17,
    marginRight: 20
  }
});
