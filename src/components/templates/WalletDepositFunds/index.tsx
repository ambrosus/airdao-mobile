import { useCallback, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleProp,
  View,
  ViewStyle
} from 'react-native';
import { useTranslation } from 'react-i18next';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useWalletStore } from '@entities/wallet';
import { ReceiveFunds } from '../ReceiveFunds';
import { styles } from './styles';

const MAX_SCROLL_Y = 64;

interface WalletDepositFundsProps {
  refetch?: () => void;
  loading?: boolean;
}

export const WalletDepositFunds = ({
  loading,
  refetch
}: WalletDepositFundsProps) => {
  const { t } = useTranslation();
  const { bottom: bottomInset } = useSafeAreaInsets();

  const { wallet } = useWalletStore();

  const scrollOffsetY = useSharedValue(0);

  const receiveFundsBottomSheetRef = useRef<BottomSheetRef>(null);
  const isRefetchedOnce = useRef<boolean>(false);

  const onReceiveFundsShowBottomSheet = useCallback(
    () => receiveFundsBottomSheetRef.current?.show(),
    []
  );

  const bottomSheetContainerStyle = useMemo(
    () => ({
      ...styles.receiveFunds,
      paddingBottom: bottomInset === 0 ? 24 : bottomInset
    }),
    [bottomInset]
  );

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
            source={require('@assets/images/deposit-funds.png')}
          />

          <Text
            fontSize={16}
            color={'#94979C'}
            fontFamily="Inter_400Regular"
            numberOfLines={2}
            style={styles.description}
          >
            {t('wallet.assets.empty.description')}
          </Text>

          <PrimaryButton
            onPress={onReceiveFundsShowBottomSheet}
            style={styles.button}
          >
            <Text
              fontSize={14}
              fontFamily="Inter_600SemiBold"
              color={COLORS.neutral0}
            >
              {t('wallet.assets.deposit.button')}
            </Text>
          </PrimaryButton>

          <BottomSheet
            ref={receiveFundsBottomSheetRef}
            title={t('account.actions.receive')}
          >
            <View style={bottomSheetContainerStyle}>
              <ReceiveFunds address={wallet?.address ?? ''} />
            </View>
          </BottomSheet>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};
