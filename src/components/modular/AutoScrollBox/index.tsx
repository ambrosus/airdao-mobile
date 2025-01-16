import React, { useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, ScrollView, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardDismissingView } from '@components/base';
import { DEVICE_HEIGHT } from '@constants/variables';
import { useKeyboardHeight } from '@hooks';
import { isAndroid, isSmallScreen, scale, verticalScale } from '@utils';
import { styles } from './styles';
const EXTRA_HEIGHT = isSmallScreen ? 164 : 0;

interface AutoScrollBoxProps {
  header?: React.JSX.Element;
  refreshControl?: React.JSX.Element | undefined;
  children: React.JSX.Element;
  autoScrollEnabled?: boolean;
  maxPointToScroll?: number;
}

export const AutoScrollBox = ({
  header,
  refreshControl,
  children,
  autoScrollEnabled = true,
  maxPointToScroll = 0
}: AutoScrollBoxProps) => {
  const [contentHeight, setContentHeight] = useState(0);

  const { top } = useSafeAreaInsets();

  const onLayout = (e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout;
    setContentHeight(contentHeight + height);
  };
  const scrollRef = useRef<ScrollView | null>(null);

  const keyboardHeight = useKeyboardHeight();
  useEffect(() => {
    const margin = scale(16);
    const componentHeightSum = contentHeight + keyboardHeight;
    const availableScreenHeight = DEVICE_HEIGHT - componentHeightSum;
    const isNeedScroll = availableScreenHeight < 0;

    if (isNeedScroll && autoScrollEnabled) {
      const scrollOfSet = Math.abs(availableScreenHeight) + margin;
      const scrollToValue =
        maxPointToScroll && scrollOfSet > maxPointToScroll
          ? maxPointToScroll
          : scrollOfSet;
      if (scrollRef?.current?.scrollTo) {
        scrollRef?.current?.scrollTo({
          y: scrollToValue,
          animated: true
        });
      }
    }
  }, [autoScrollEnabled, contentHeight, keyboardHeight, maxPointToScroll, top]);

  return (
    <>
      {header && <View onLayout={onLayout}>{header}</View>}
      <KeyboardAwareScrollView
        innerRef={(ref) => {
          // @ts-ignore
          scrollRef.current = ref;
        }}
        style={styles.main}
        keyboardShouldPersistTaps={isAndroid ? 'handled' : 'always'}
        extraScrollHeight={verticalScale(EXTRA_HEIGHT)}
        enableOnAndroid
        automaticallyAdjustKeyboardInsets
        refreshControl={refreshControl}
      >
        <KeyboardDismissingView onLayout={onLayout}>
          {children}
        </KeyboardDismissingView>
      </KeyboardAwareScrollView>
    </>
  );
};
