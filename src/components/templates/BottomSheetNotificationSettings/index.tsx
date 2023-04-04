import React, { ForwardedRef, forwardRef } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Switch } from 'react-native-gesture-handler';
import { BottomSheet, Header, Slider } from '@components/composite';
import {
  BottomSheetProps,
  BottomSheetRef
} from '@components/composite/BottomSheet/BottomSheet.types';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { Button, Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { CloseIcon } from '@components/svg/icons';
import { verticalScale } from '@utils/scaling';
import { useAMBPrice } from '@hooks/query';
import { styles } from './styles';

const Title = ({ children }: { children: React.ReactNode }) => (
  <Text title fontFamily="Inter_600SemiBold">
    {children}
  </Text>
);

export const BottomSheetNotificationSettings = forwardRef<
  BottomSheetRef,
  BottomSheetProps
>((props, ref) => {
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const { data } = useAMBPrice();

  const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = useWindowDimensions();

  return (
    <BottomSheet height={WINDOW_HEIGHT * 0.9} ref={localRef} {...props}>
      <View>
        <Header
          title="Notification settings"
          titlePosition="center"
          backIconVisible={false}
          style={styles.header}
          contentLeft={
            <Button onPress={localRef.current?.dismiss}>
              <CloseIcon />
            </Button>
          }
          contentRight={
            <Button>
              <Text
                title
                fontFamily="Inter_600SemiBold"
                color={COLORS.darkGrey}
                opacity={0.5}
              >
                Save
              </Text>
            </Button>
          }
        />
        <View style={styles.container}>
          <Text color="#646464" fontWeight="400" fontSize={15}>
            Toggle which notifications you want to receive
          </Text>
          {/* Price alerts */}
          <Spacer value={verticalScale(32)} />
          <Row alignItems="center" justifyContent="space-between">
            <Title>Price alerts</Title>
            <Switch />
          </Row>
          {/* Price Threshold */}
          <Spacer value={verticalScale(32)} />
          <View>
            <Row alignItems="center" justifyContent="space-between">
              <Title>Set price threshold</Title>
              <Text fontWeight="500" fontSize={12}>
                AMB PRICE: ~${data?.priceUSD}
              </Text>
            </Row>
            <Spacer value={verticalScale(32)} />
            <Slider width={WINDOW_WIDTH * 0.9} minValue={0} maxValue={15000} />
          </View>
          {/* Percentage Change */}
          <Spacer value={verticalScale(32)} />
          <View>
            <Row alignItems="center" justifyContent="space-between">
              <Title>Percentage change alert</Title>
            </Row>
            <Spacer value={verticalScale(32)} />
            <Slider width={WINDOW_WIDTH * 0.9} minValue={0} maxValue={15000} />
          </View>
          <Spacer value={verticalScale(38)} />
          <View style={styles.separator} />
          <Spacer value={verticalScale(32)} />
          {/* Transaction alerts */}
          <Row alignItems="center" justifyContent="space-between">
            <Title>Transaction alerts</Title>
          </Row>
          {/* Transaction Threshold */}
          <Spacer value={verticalScale(32)} />
          <View>
            <Row alignItems="center" justifyContent="space-between">
              <Title>Set transaction threshold</Title>
            </Row>
            <Spacer value={verticalScale(32)} />
            <View style={{ alignSelf: 'center' }}>
              <Slider
                width={WINDOW_WIDTH * 0.8}
                minValue={0}
                maxValue={15000}
                isSecondPointVisible={true}
              />
            </View>
          </View>
        </View>
      </View>
    </BottomSheet>
  );
});
