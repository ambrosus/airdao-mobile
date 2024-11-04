import React, { forwardRef } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { useForwardedRef } from '@hooks';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Spacer } from '@components/base';
import { scale } from '@utils/scaling';
import { useSwapContextSelector } from '@features/swap/context';
import { RenderBottomSheetStatusView } from './components/render';
import { useTranslation } from 'react-i18next';

export const BottomSheetPreviewSwap = forwardRef<BottomSheetRef, unknown>(
  (_, ref) => {
    const { t } = useTranslation();
    const bottomSheetRef = useForwardedRef(ref);
    const { isProcessingSwap } = useSwapContextSelector();

    return (
      <BottomSheet
        title={t('swap.button.review')}
        swiperIconVisible={false}
        closeOnBackPress={!isProcessingSwap}
        swipingEnabled={false}
        ref={bottomSheetRef}
      >
        <View style={styles.container}>
          <RenderBottomSheetStatusView />
        </View>

        <Spacer value={scale(40)} />
      </BottomSheet>
    );
  }
);
