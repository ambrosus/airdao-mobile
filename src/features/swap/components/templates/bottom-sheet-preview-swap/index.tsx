import React, { forwardRef, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { useForwardedRef } from '@hooks';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Spacer } from '@components/base';
import { scale } from '@utils/scaling';
import { useSwapContextSelector } from '@features/swap/context';
import { RenderBottomSheetStatusView } from './components/render';
import { useTranslation } from 'react-i18next';
import { useSwapBottomSheetHandler } from '@features/swap/lib/hooks';
import { BottomSheetStatus } from '@features/swap/types';
import { _delayNavigation } from '@utils';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '@appTypes';

export const BottomSheetPreviewSwap = forwardRef<BottomSheetRef, unknown>(
  (_, ref) => {
    const { t } = useTranslation();
    const navigation: HomeNavigationProp = useNavigation();
    const bottomSheetRef = useForwardedRef(ref);
    const { isProcessingSwap } = useSwapContextSelector();
    const {
      bottomSheetSwapStatus,
      onReviewSwapDismiss,
      onChangeBottomSheetSwapStatus
    } = useSwapBottomSheetHandler();

    const isPreview = useMemo(
      () => bottomSheetSwapStatus === BottomSheetStatus.PREVIEW,
      [bottomSheetSwapStatus]
    );

    const onSuccessBottomSheetDismiss = useCallback(() => {
      onChangeBottomSheetSwapStatus(BottomSheetStatus.PREVIEW);
      if (bottomSheetSwapStatus === BottomSheetStatus.SUCCESS) {
        _delayNavigation(onReviewSwapDismiss, () =>
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'HomeScreen' }]
            })
          )
        );
      }
    }, [
      bottomSheetSwapStatus,
      navigation,
      onChangeBottomSheetSwapStatus,
      onReviewSwapDismiss
    ]);

    return (
      <BottomSheet
        ref={bottomSheetRef}
        title={isPreview ? t('common.review') : undefined}
        swiperIconVisible={false}
        closeOnBackPress={!isProcessingSwap}
        onBackdropPress={onSuccessBottomSheetDismiss}
        onCustomCrossPress={onSuccessBottomSheetDismiss}
        swipingEnabled={false}
      >
        <View style={styles.container}>
          <RenderBottomSheetStatusView />
        </View>

        <Spacer value={scale(40)} />
      </BottomSheet>
    );
  }
);
