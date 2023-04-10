import React, { forwardRef } from 'react';
import { View, useWindowDimensions } from 'react-native';
import {
  BottomSheet,
  BottomSheetProps,
  BottomSheetRef
} from '@components/composite';
import { styles } from './styles';
import { Checkmark, CloseIcon } from '@components/svg/icons';
import { scale, verticalScale } from '@utils/scaling';
import { Button, Spacer, Text } from '@components/base';
import { StringUtils } from '@utils/string';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForwardedRef } from '@hooks/useForwardedRef';

interface BottomSheetWatchlistAddSuccessProps extends BottomSheetProps {
  address: string;
}

export const BottomSheetWatchlistAddSuccess = forwardRef<
  BottomSheetRef,
  BottomSheetWatchlistAddSuccessProps
>((props, ref) => {
  const { address, ...bottomSheetProps } = props;
  const localRef = useForwardedRef<BottomSheetRef>(ref);
  const { height: WINDOW_HEIGHT } = useWindowDimensions();
  const { top: topInset } = useSafeAreaInsets();

  const dismiss = () => {
    localRef.current?.dismiss();
  };

  return (
    <BottomSheet
      ref={localRef}
      height={WINDOW_HEIGHT - topInset}
      {...bottomSheetProps}
    >
      <View style={styles.container}>
        <Button onPress={dismiss} style={styles.closeButton}>
          <CloseIcon />
        </Button>
        <View style={styles.content}>
          <Checkmark
            size={scale(96)}
            iconScale={4}
            fillColor="#BFBFBF"
            iconColor="#FFFFFF"
          />
          <Spacer value={verticalScale(49)} />
          <Text align="center" fontSize={17} fontWeight="600" color="#000000">
            You are on a roll!
            {`\n${StringUtils.formatAddress(
              address,
              11,
              5
            )} has been added to your watchlist.`}
          </Text>
          <Spacer value={verticalScale(11)} />
          <Text align="center" fontWeight="400" fontSize={13} color="#646464">
            {
              "Let's personalize new address! Click 'Edit Address' to get started"
            }
          </Text>
        </View>
        <View style={styles.buttons}>
          <Button
            type="circular"
            style={{ ...styles.button, backgroundColor: '#676B73' }}
          >
            <Text title color="#FFFFFF">
              Edit Address
            </Text>
          </Button>
          <Spacer value={verticalScale(24)} />
          <Button
            onPress={dismiss}
            type="circular"
            style={{ ...styles.button, backgroundColor: '#0e0e0e0d' }}
          >
            <Text title>Done</Text>
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
});
