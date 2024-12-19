import React, { useMemo, useRef } from 'react';
import { ActivityIndicator, Image, StyleProp, ViewStyle } from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PanGestureHandlerGestureEvent
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { styles } from './styles';

const MAX_SCROLL_Y = 64;

interface WalletNoNFTsViewProps {
  refetch?: () => void;
  loading?: boolean;
}

export const WalletNoNFTsView = ({
  refetch,
  loading
}: WalletNoNFTsViewProps) => {
  const scrollOffsetY = useSharedValue(0);

  const isRefetchedOnce = useRef<boolean>(false);

  const animatedStyle = useAnimatedStyle(() => {
    const isRangeOffsetFits =
      scrollOffsetY.value > MAX_SCROLL_Y || scrollOffsetY.value < 0;

    return {
      transform: [
        {
          translateY: isRangeOffsetFits
            ? withTiming(0, { duration: 300 })
            : scrollOffsetY.value
        }
      ]
    };
  });

  const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    const offset = Math.floor(event.nativeEvent.translationY);
    scrollOffsetY.value = offset;

    if (offset >= 50 && offset <= 64 && !isRefetchedOnce.current) {
      isRefetchedOnce.current = true;
      typeof refetch === 'function' ? refetch() : null;
    } else if (offset < 50 || offset > 64) {
      isRefetchedOnce.current = false;
    }
  };

  const onGestureEnd = () => {
    if (scrollOffsetY.value < MAX_SCROLL_Y) {
      scrollOffsetY.value = withTiming(0, { duration: 300 });
    }
  };

  const loaderStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      opacity: !loading ? 0 : 1,
      paddingTop: 24
    }),
    [loading]
  );

  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
      <ActivityIndicator style={loaderStyle} />
      <PanGestureHandler onGestureEvent={onGestureEvent} onEnded={onGestureEnd}>
        <Animated.View style={[styles.container, animatedStyle]}>
          <Image
            style={styles.thumbnail}
            source={require('@assets/images/no-nfts-thumb.png')}
          />

          <Text
            fontSize={16}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral800}
          >
            No NFTs yet.
          </Text>

          <Text
            fontSize={15}
            color={COLORS.neutral500}
            fontFamily="Inter_400Regular"
            style={styles.description}
          >
            Stay tuned for upcoming events and activities to earn exclusive
            NFTs.
          </Text>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};
