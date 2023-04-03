import React, { ForwardedRef, forwardRef } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { BottomSheetSwiperIcon } from '@components/svg/BottomSheetSwiperIcon';
import { BottomSheet } from '@components/composite';
import {
  BottomSheetProps,
  BottomSheetRef
} from '@components/composite/BottomSheet';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { Button, Row, Spacer, Text } from '@components/base';
import { RightArrowIcon } from '@components/svg/icons';
import { scale, verticalScale } from '@utils/scaling';

interface Platform {
  title: string;
  url: string;
}
const platforms: Platform[] = [
  {
    title: 'Firepot (DEX)',
    url: ''
  },
  {
    title: 'Binance',
    url: ''
  },
  {
    title: 'Kucoin',
    url: ''
  }
];

export const BottomSheetTrade = forwardRef<BottomSheetRef, BottomSheetProps>(
  (props, ref) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);

    const renderPlatform = (item: Platform) => {
      const openLink = async () => {
        if (!item.url) return;
        const canOpenURL = await Linking.canOpenURL(item.url);
        if (canOpenURL) {
          Linking.openURL(item.url);
        }
      };
      return (
        <Button
          type="circular"
          onPress={openLink}
          key={item.title}
          style={styles.row}
        >
          <Row alignItems="center">
            <Text fontFamily="Inter_600SemiBold">{item.title}</Text>
            <Spacer horizontal value={scale(12)} />
            <View style={{ transform: [{ rotate: '315deg' }] }}>
              <RightArrowIcon color="#000000" />
            </View>
          </Row>
        </Button>
      );
    };

    return (
      <BottomSheet ref={localRef}>
        <View style={styles.container}>
          <Spacer value={16} />
          <BottomSheetSwiperIcon />
          <Spacer value={verticalScale(34)} />
          <Text fontWeight="600" fontFamily="Inter_600SemiBold" title>
            Trade AMB
          </Text>
          <Spacer value={verticalScale(38)} />
          {platforms.map(renderPlatform)}
        </View>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: verticalScale(52)
  },
  row: {
    backgroundColor: '#2f2b430d',
    width: '90%',
    marginBottom: verticalScale(48),
    paddingVertical: verticalScale(12)
  }
});
