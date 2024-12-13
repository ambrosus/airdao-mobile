import { COLORS } from '@constants/colors';
import { StringUtils } from '@utils/string';
import { StakePreviewDataModel } from '@features/harbor/components/modular/harbor-preview/model';
import { CryptoCurrencyCode } from '@appTypes';

export const parseStakeData = (previewData: StakePreviewDataModel) => {
  return {
    form: [
      {
        name: 'harbor.staked.amount',
        value: previewData.amount,
        symbol: previewData.token
      },
      {
        name: 'harbor.receive.amount.preview.title',
        value: previewData.amount,
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
        value: previewData.amount
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
