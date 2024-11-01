import React, { forwardRef, useMemo } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { useForwardedRef } from '@hooks';
import { PreviewInformation } from '@features/swap/components/composite';
import { BottomSheetReviewTokenItem } from '@features/swap/components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Spacer, Text } from '@components/base';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { FIELD } from '@features/swap/types';
import { SubmitSwapActions } from '../../modular';
import { useSwapContextSelector } from '@features/swap/context';
import { useTranslation } from 'react-i18next';
import { isETHtoWrapped, isWrappedToETH } from '@features/swap/utils';
import { useSwapTokens } from '@features/swap/lib/hooks';

export const BottomSheetPreviewSwap = forwardRef<BottomSheetRef, unknown>(
  (_, ref) => {
    const { t } = useTranslation();
    const bottomSheetRef = useForwardedRef(ref);
    const { isProcessingSwap } = useSwapContextSelector();
    const { tokensRoute } = useSwapTokens();

    const isWrapOrUnwrapETH = useMemo(() => {
      return isETHtoWrapped(tokensRoute) || isWrappedToETH(tokensRoute);
    }, [tokensRoute]);

    return (
      <BottomSheet
        swiperIconVisible={!isProcessingSwap}
        closeOnBackPress={!isProcessingSwap}
        swipingEnabled={!isProcessingSwap}
        ref={bottomSheetRef}
      >
        <View style={styles.container}>
          <Text
            fontSize={20}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral800}
            style={styles.heading}
          >
            {t('swap.bottom.sheet.heading')}
          </Text>

          <View style={styles.preview}>
            <BottomSheetReviewTokenItem type={FIELD.TOKEN_A} />
            <View style={styles.divider} />
            <BottomSheetReviewTokenItem type={FIELD.TOKEN_B} />
          </View>

          {!isWrapOrUnwrapETH && <PreviewInformation />}

          <Spacer value={scale(24)} />
          <SubmitSwapActions />
        </View>

        <Spacer value={scale(40)} />
      </BottomSheet>
    );
  }
);
