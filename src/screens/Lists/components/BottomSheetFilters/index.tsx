import React, { ForwardedRef, forwardRef, RefObject } from 'react';
import { Button, Row, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';
import { BottomSheet, Slider } from '@components/composite';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { COLORS } from '@constants/colors';
import { StyleSheet, View } from 'react-native';
import { Spacer } from '@components/base/Spacer';
import { CloseIcon } from '@components/svg/icons/Close';

type Props = {
  ref: RefObject<BottomSheetRef>;
};

export const BottomSheetFilters = forwardRef<BottomSheetRef, Props>(
  (props, ref) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
    return (
      <BottomSheet height={800} ref={localRef}>
        <View style={styles.container}>
          <Row justifyContent="space-between" alignItems="center">
            <Button type="base" onPress={() => localRef.current?.dismiss()}>
              <View style={{ width: 38 }}>
                <CloseIcon />
              </View>
            </Button>
            <Text
              style={{
                alignSelf: 'center',
                fontFamily: 'Inter_600SemiBold',
                fontSize: 15,
                color: COLORS.black
              }}
            >
              Filter by
            </Text>
            <Button type="base" onPress={() => localRef.current?.dismiss()}>
              <Text
                fontFamily="Inter_600SemiBold"
                color={COLORS.lightGrey}
                fontSize={16}
              >
                Done
              </Text>
            </Button>
          </Row>
          <Spacer value={39} />
          <Text
            fontFamily="Inter_600SemiBold"
            color={COLORS.black}
            fontSize={16}
          >
            Balance
          </Text>
          <Spacer value={6} />
          <Text
            fontFamily="Inter_500Medium"
            color={COLORS.lightGrey}
            fontSize={12}
          >
            Filter the list to show wallets with a balance above or below a
            certain amount.
          </Text>
          <Spacer value={24} />
          <View style={styles.slider}>
            <Slider
              width={320}
              minValue={0}
              maxValue={100}
              isSecondPointVisible={true}
            />
          </View>
          <Spacer value={40} />
          <View style={styles.separator} />
          <Spacer value={20} />
          <Text
            fontFamily="Inter_600SemiBold"
            color={COLORS.black}
            fontSize={16}
          >
            Number of wallets
          </Text>
          <Spacer value={6} />
          <Text
            fontFamily="Inter_500Medium"
            color={COLORS.lightGrey}
            fontSize={12}
          >
            Filter to show lists within a certain amount of wallets
          </Text>
          <Spacer value={24} />
          <View style={styles.slider}>
            <Slider
              width={320}
              minValue={0}
              maxValue={100}
              isSecondPointVisible={true}
            />
          </View>
        </View>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 20
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.silver,
    width: '100%'
  },
  sliderText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    justifyContent: 'flex-start',
    color: COLORS.silver
  },
  sliderTextContainer: {
    marginTop: -40,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  slider: {
    alignItems: 'center'
  }
});
