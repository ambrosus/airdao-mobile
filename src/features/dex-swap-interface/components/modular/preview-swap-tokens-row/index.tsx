import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { Row } from '@components/base';
import { RightArrowIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { PreviewSwapToken } from '@features/dex-swap-interface/components/composite';

export const PreviewSwapTokensRow = () => {
  return (
    <Row alignItems="center" justifyContent="space-between">
      <PreviewSwapToken type="INPUT" />
      <View style={styles.previewTokensDivider}>
        <RightArrowIcon color={COLORS.neutral900} />
      </View>
      <PreviewSwapToken type="OUTPUT" />
    </Row>
  );
};
