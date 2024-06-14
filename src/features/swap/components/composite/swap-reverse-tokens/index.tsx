import React, { useCallback } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { useSwapSelectTokens } from '@features/swap/lib/hooks';
import { Divider } from '@/features/swap/components/base';
import { Button, Spacer } from '@components/base';
import { SwapIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';

export const SwapReverseTokens = () => {
  const { onReverseSelectedTokens } = useSwapSelectTokens();

  const onReverseSelectedTokensPress = useCallback(() => {
    onReverseSelectedTokens();
  }, [onReverseSelectedTokens]);

  return (
    <>
      <Spacer value={scale(8)} />
      <Divider>
        <View style={styles.wrapper}>
          <Button onPress={onReverseSelectedTokensPress} style={styles.button}>
            <SwapIcon scale={0.75} color={COLORS.neutral400} />
          </Button>
        </View>
      </Divider>
      <Spacer value={scale(8)} />
    </>
  );
};
