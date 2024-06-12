import React, { useMemo } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { Divider } from '@features/dex-swap-interface/components/composite';
import { Button, Spacer } from '@components/base';
import { SwapIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { useDEXSwapActionsHandler } from '@features/dex-swap-interface/lib';
import { scale } from '@utils/scaling';
import { useDEXSwapContextSelector } from '@features/dex-swap-interface/model';

export const SwapDivider = () => {
  const { onReverseSelectedTokens } = useDEXSwapActionsHandler();
  const { selectedTokens } = useDEXSwapContextSelector();

  const disabled = useMemo(() => {
    return selectedTokens.INPUT === null || selectedTokens.OUTPUT === null;
  }, [selectedTokens]);

  return (
    <>
      <Spacer value={scale(8)} />
      <Divider>
        <View style={styles.wrapper}>
          <Button
            disabled={disabled}
            onPress={onReverseSelectedTokens}
            style={styles.button}
          >
            <SwapIcon scale={0.75} color={COLORS.neutral400} />
          </Button>
        </View>
      </Divider>
      <Spacer value={scale(8)} />
    </>
  );
};
