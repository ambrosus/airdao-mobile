import React, { forwardRef } from 'react';
import { styles } from './styles';
import { Text } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { useForwardedRef } from '@hooks';
import { COLORS } from '@constants/colors';

export const BottomSheetFilters = forwardRef<BottomSheetRef, unknown>(
  (_, ref) => {
    const bottomSheetRef = useForwardedRef(ref);
    return (
      <BottomSheet ref={bottomSheetRef} swiperIconVisible>
        <Text
          fontSize={20}
          fontFamily="Inter_600SemiBold"
          color={COLORS.neutral800}
          style={styles.heading}
        >
          Filter by
        </Text>
      </BottomSheet>
    );
  }
);
