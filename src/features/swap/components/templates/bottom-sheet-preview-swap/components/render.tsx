import { View } from 'react-native';
import { Spacer } from '@components/base';
import { BottomSheetReviewTokenItem } from '@features/swap/components/base';
import { PreviewInformation } from '@features/swap/components/composite';
import { SubmitSwapActions } from '@features/swap/components/modular';
import { useSwapBottomSheetHandler } from '@features/swap/lib/hooks';
import { BottomSheetStatus, FIELD } from '@features/swap/types';
import { scale } from '@utils';
import { styles } from '../styles';
import { ErrorSwapView } from './error';
import { SuccessSwapView } from './success';

export const RenderBottomSheetStatusView = () => {
  const { bottomSheetSwapStatus } = useSwapBottomSheetHandler();

  switch (bottomSheetSwapStatus) {
    case BottomSheetStatus.PREVIEW: {
      return (
        <>
          <View style={styles.preview}>
            <BottomSheetReviewTokenItem type={FIELD.TOKEN_A} />
            <View style={styles.divider} />
            <BottomSheetReviewTokenItem type={FIELD.TOKEN_B} />
          </View>

          <PreviewInformation />

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
