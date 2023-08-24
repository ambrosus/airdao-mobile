import React, { ForwardedRef, forwardRef } from 'react';
import {
  BottomSheet,
  BottomSheetProps,
  BottomSheetRef,
  Header
} from '@components/composite';
import { Row, Text } from '@components/base';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const RecoveryPhraseModal = forwardRef<BottomSheetRef, BottomSheetProps>(
  (props, ref) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);

    return (
      <BottomSheet swiperIconVisible ref={localRef} height={scale(175)}>
        <Header
          title={
            <Text fontFamily="Inter_700Bold" fontSize={20} color={COLORS.nero}>
              What is a recovery phrase?
            </Text>
          }
          backIconVisible={false}
          style={{ shadowColor: 'transparent' }}
        />
        <Text
          align="center"
          fontFamily="Inter_500Medium"
          fontSize={16}
          style={{ paddingHorizontal: scale(16) }}
        >
          Your recovery phrase is a set of 12 random words, and it's the only
          way to get into your wallet if you lose your device.
        </Text>
      </BottomSheet>
    );
  }
);
