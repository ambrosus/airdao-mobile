import { CryptoCurrencyCode } from '@appTypes';
import { COLORS } from '@constants/colors';
import { StakePreviewDataModel } from '@features/harbor/components/harbor-preview/model';
import { NumberUtils, StringUtils } from '@utils';

export const parseStakeData = (previewData: StakePreviewDataModel) => {
  return {
    form: [
      {
        name: 'harbor.staked.amount',
        value: NumberUtils.limitDecimalCount(previewData.amount, 2),
        symbol: previewData.token
      },
      {
        name: 'harbor.receive.amount.preview.title',
        value: NumberUtils.limitDecimalCount(previewData.amount, 2),
        symbol: previewData.receiveToken
      },
      {
        name: 'common.transaction.from',
        value: StringUtils.formatAddress(previewData.fromAddress, 8, 4)
      },
      {
        name: 'harbor.stake.apy',
        value: `${previewData.apy} %`,
        textStyle: { color: COLORS.success300 }
      }
    ],
    success: [
      {
        title: true,
        name: 'harbor.successfully.stake.header',
        symbol: CryptoCurrencyCode.stAMB,
        value: NumberUtils.limitDecimalCount(previewData.amount, 2)
      },
      {
        name: 'harbor.stake.from',
        value: StringUtils.formatAddress(previewData.fromAddress, 8, 4)
      },
      {
        name: 'harbor.stake.apy',
        value: `${previewData.apy} %`,
        textStyle: { color: COLORS.success300 }
      }
    ]
  };
};
