import React, { forwardRef, useMemo } from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { styles } from './styles';
import { useForwardedRef } from '@hooks';
import { PreviewInformation } from '@features/swap/components/composite';
import { BottomSheetReviewTokenItem } from '@features/swap/components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Row, Spacer, Text } from '@components/base';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { FIELD } from '@features/swap/types';
import { useSwapContextSelector } from '@features/swap/context';
import { PrimaryButton } from '@components/modular';

export const BottomSheetPreviewSwap = forwardRef<BottomSheetRef, unknown>(
  (_, ref) => {
    const bottomSheetRef = useForwardedRef(ref);
    const { uiBottomSheetInformation, latestSelectedTokens, isExactInRef } =
      useSwapContextSelector();

    const swapButtonString = useMemo(() => {
      if (uiBottomSheetInformation.allowance !== 'suitable') {
        const isExactIn = isExactInRef.current;
        const selectedTokens =
          latestSelectedTokens.current[
            isExactIn ? FIELD.TOKEN_A : FIELD.TOKEN_B
          ];

        return {
          firstStep: `Approve ${selectedTokens?.symbol}`,
          secondStep: 'Swap now'
        };
      }

      return { firstStep: 'Swap now' };
    }, [
      isExactInRef,
      latestSelectedTokens,
      uiBottomSheetInformation.allowance
    ]);

    const firstStepTypographyStyle: StyleProp<TextStyle> = useMemo(() => {
      return {
        color: COLORS.neutral0
      };
    }, []);

    const secondStepTypographyStyle: StyleProp<TextStyle> = useMemo(() => {
      return {
        color:
          uiBottomSheetInformation.allowance === 'increase'
            ? COLORS.neutral400
            : COLORS.neutral0
      };
    }, [uiBottomSheetInformation.allowance]);

    const footerActionButtonStyle: StyleProp<ViewStyle> = useMemo(() => {
      return {
        width:
          uiBottomSheetInformation.allowance !== 'suitable' ? '47%' : '100%'
      };
    }, [uiBottomSheetInformation.allowance]);

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

          <Spacer value={scale(24)} />
          <View style={styles.footer}>
            <PrimaryButton style={footerActionButtonStyle} onPress={() => null}>
              <Text style={firstStepTypographyStyle}>
                {swapButtonString.firstStep}
              </Text>
            </PrimaryButton>

            {uiBottomSheetInformation.allowance !== 'suitable' && (
              <PrimaryButton
                disabled={uiBottomSheetInformation.allowance === 'increase'}
                style={footerActionButtonStyle}
                onPress={() => null}
              >
                <Text style={secondStepTypographyStyle}>
                  {swapButtonString.secondStep}
                </Text>
              </PrimaryButton>
            )}
          </View>
        </View>
        <Spacer value={scale(40)} />
      </BottomSheet>
    );
  }
);
