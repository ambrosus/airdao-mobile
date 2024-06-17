import React, { forwardRef } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { useForwardedRef } from '@hooks';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Row, Spacer, Text } from '@components/base';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { BottomSheetReviewTokenItem } from '../../base';
import { FIELD } from '@features/swap/types';
import { PreviewInformation } from '../../composite';

export const BottomSheetPreviewSwap = forwardRef<BottomSheetRef, unknown>(
  (_, ref) => {
    const bottomSheetRef = useForwardedRef(ref);
    return (
      <BottomSheet swiperIconVisible ref={bottomSheetRef}>
        <View style={styles.container}>
          <Text
            fontSize={20}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral800}
            style={styles.heading}
          >
            Ready to swap?
          </Text>

          <Row
            justifyContent="space-between"
            style={{ width: '100%', paddingTop: 16 }}
          >
            <BottomSheetReviewTokenItem type={FIELD.TOKEN_A} />
            <BottomSheetReviewTokenItem type={FIELD.TOKEN_B} />
          </Row>

          <PreviewInformation />
        </View>
        <Spacer value={scale(40)} />
      </BottomSheet>
    );
  }
);
