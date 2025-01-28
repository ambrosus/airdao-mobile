import { forwardRef, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { HomeNavigationProp } from '@appTypes';
import { Spacer } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { useSwapContextSelector } from '@features/swap/context';
import { useSwapBottomSheetHandler } from '@features/swap/lib/hooks';
import { BottomSheetStatus } from '@features/swap/types';
import { useForwardedRef } from '@hooks';
import { scale, _delayNavigation } from '@utils';
import { RenderBottomSheetStatusView } from './components/render';
import { styles } from './styles';

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
