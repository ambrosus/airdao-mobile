import React, { useMemo } from 'react';
import { Row, Text } from '@components/base';
import { TokenLogo } from '@components/modular';
import { styles } from '@features/harbor/components/modular/harbor-stake-previews/styles';
import { NumberUtils } from '@utils/number';
import { StringUtils } from '@utils/string';
import { PreviewDataModel } from '@features/harbor/components/modular/harbor-stake-previews/models';
import { COLORS } from '@constants/colors';

export const useParsePreviewData = (previewData: PreviewDataModel) => {
  const formPreviewData = useMemo(
    () => [
      {
        title: 'harbor.withdraw.preview.header',
        content: (
          <Row alignItems="center">
            <TokenLogo token={previewData.token} scale={0.8} />
            <Text style={styles.valueText}>
              {NumberUtils.limitDecimalCount(previewData.amount, 2)}{' '}
              {previewData.token}
            </Text>
          </Row>
        )
      },
      {
        title: 'harbor.receive.amount.preview.title',
        content: (
          <Row alignItems="center">
            <TokenLogo token={previewData.receiveToken} scale={0.8} />
            <Text style={styles.valueText}>
              {NumberUtils.limitDecimalCount(previewData.receiveAmount, 2)}{' '}
              {previewData.receiveToken}
            </Text>
          </Row>
        )
      },
      {
        title: 'harbor.stake.from',
        content: (
          <Text style={styles.valueText}>
            {StringUtils.formatAddress(previewData.fromAddress, 10, 4)}
          </Text>
        )
      },
      {
        title: 'harbor.stake.apy',
        content: (
          <Text style={{ ...styles.valueText, ...styles.apy }}>
            {previewData.apy} %
          </Text>
        )
      }
    ],
    [previewData]
  );
  const successPreviewData = useMemo(
    () => [
      {
        title: 'common.transaction.from',
        content: (
          <Text fontSize={14} color={COLORS.neutral900}>
            {StringUtils.formatAddress(previewData.fromAddress, 10, 3)}
          </Text>
        )
      },
      {
        title: 'staking.apy',
        content: (
          <Text fontSize={14} color={COLORS.success300}>
            {previewData.apy} %
          </Text>
        )
      }
    ],
    [previewData]
  );
  return {
    formPreviewData,
    successPreviewData
  };
};
