import React, { useMemo } from 'react';
import { WithdrawPreviewModel } from '@features/harbor/components/modular/harbor-withdraw-preview/models';
import { CryptoCurrencyCode } from '@appTypes';
import { Row, Text } from '@components/base';
import { TokenLogo } from '@components/modular';
import { styles } from '@features/harbor/components/modular/harbor-stake-previews/styles';
import { NumberUtils } from '@utils/number';

export const useHarborWithdrawPreview = (previewData: WithdrawPreviewModel) => {
  const formParsedData = useMemo(
    () => [
      {
        title: 'harbor.withdraw.preview.amb.reward',
        content: (
          <Row alignItems="center">
            <TokenLogo token={CryptoCurrencyCode.AMB} scale={0.8} />
            <Text style={styles.valueText}>
              {NumberUtils.limitDecimalCount(previewData.rewardAmb, 2)}{' '}
              {CryptoCurrencyCode.AMB}
            </Text>
          </Row>
        )
      },
      {
        title: 'harbor.withdraw.preview.bond.reward',
        content: (
          <Row alignItems="center">
            <TokenLogo token={CryptoCurrencyCode.BOND} scale={0.8} />
            <Text style={styles.valueText}>
              {NumberUtils.limitDecimalCount(previewData.rewardBond, 2)}{' '}
              {CryptoCurrencyCode.BOND}
            </Text>
          </Row>
        )
      },
      {
        title: 'harbor.withdraw.preview.delay',
        content: (
          <Text style={styles.valueText}>
            {previewData.delay} {+previewData.delay === 1 ? 'day' : 'days'}
          </Text>
        )
      }
    ],
    [previewData]
  );
  const successParsedData = useMemo(
    () => [
      {
        title: 'harbor.withdraw.preview.header',
        content: (
          <Row alignItems="center">
            <TokenLogo token={CryptoCurrencyCode.stAMB} scale={0.8} />
            <Text style={styles.valueText}>
              {NumberUtils.limitDecimalCount(previewData.amount, 2)}{' '}
              {CryptoCurrencyCode.stAMB}
            </Text>
          </Row>
        )
      },
      {
        title: 'harbor.withdraw.preview.bond.reward',
        content: (
          <Text style={styles.valueText}>
            111{NumberUtils.limitDecimalCount(previewData.rewardAmb, 2)}{' '}
            {CryptoCurrencyCode.AMB}
          </Text>
        )
      },
      {
        title: 'harbor.withdraw.preview.delay',
        content: (
          <Text style={styles.valueText}>
            {previewData.delay} {+previewData.delay === 1 ? 'day' : 'days'}
          </Text>
        )
      }
    ],
    [previewData]
  );
  return { formParsedData, successParsedData };
};
