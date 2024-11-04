import React, { useMemo } from 'react';
import { View } from 'react-native';
import { styles } from '../styles';
import { Spacer } from '@components/base';
import { BottomSheetReviewTokenItem } from '@features/swap/components/base';
import { PreviewInformation } from '@features/swap/components/composite';
import { SubmitSwapActions } from '@features/swap/components/modular';
import {
  useSwapBottomSheetHandler,
  useSwapTokens
} from '@features/swap/lib/hooks';
import { BottomSheetStatus, FIELD } from '@features/swap/types';
import { isETHtoWrapped, isWrappedToETH } from '@features/swap/utils';
import { scale } from '@utils/scaling';
import { SuccessSwapView } from './success';
import { ErrorSwapView } from './error';

export const RenderBottomSheetStatusView = () => {
  const { tokensRoute } = useSwapTokens();
  const { bottomSheetSwapStatus } = useSwapBottomSheetHandler();

  const isWrapOrUnwrapETH = useMemo(() => {
    return isETHtoWrapped(tokensRoute) || isWrappedToETH(tokensRoute);
  }, [tokensRoute]);

  switch (bottomSheetSwapStatus) {
    case BottomSheetStatus.PREVIEW: {
      return (
        <>
          <View style={styles.preview}>
            <BottomSheetReviewTokenItem type={FIELD.TOKEN_A} />
            <View style={styles.divider} />
            <BottomSheetReviewTokenItem type={FIELD.TOKEN_B} />
          </View>

          {!isWrapOrUnwrapETH && <PreviewInformation />}

          <Spacer value={scale(24)} />
          <SubmitSwapActions />
        </>
      );
    }
    case BottomSheetStatus.SUCCESS: {
      return <SuccessSwapView />;
    }
    case BottomSheetStatus.ERROR: {
      return <ErrorSwapView />;
    }
  }
};
