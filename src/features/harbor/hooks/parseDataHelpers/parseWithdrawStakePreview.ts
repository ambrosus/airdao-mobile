import { WithdrawPreviewDataModel } from '@features/harbor/components/harbor-preview/model';
import { CryptoCurrencyCode } from '@appTypes';

export const parseWithdrawStakePreview = (
  previewData: WithdrawPreviewDataModel
) => {
  return {
    form: [
      {
        name: 'harbor.withdraw.amount',
        value: previewData.withdrawAmount,
        symbol: CryptoCurrencyCode.stAMB
      },
      {
        name: 'harbor.withdraw.preview.amb.reward',
        value: previewData.rewardAmb,
        symbol: CryptoCurrencyCode.AMB
      },
      {
        name: 'harbor.withdraw.preview.bond.reward',
        value: previewData.rewardBond,
        symbol: CryptoCurrencyCode.BOND
      },
      {
        name: 'harbor.withdraw.preview.delay',
        value: previewData.delay,
        timeSymbol: previewData.delay === '1' ? 'common.day' : 'common.days'
      }
    ],
    success: [
      {
        title: true,
        name: 'harbor.withdraw.preview.success.header',
        symbol: CryptoCurrencyCode.stAMB,
        value: previewData.withdrawAmount
      },
      {
        name: 'harbor.withdraw.preview.amb.reward',
        value: `${previewData.rewardAmb} ${CryptoCurrencyCode.AMB}`
      },
      {
        name: 'harbor.withdraw.preview.bond.reward',
        value: `${previewData.rewardBond} ${CryptoCurrencyCode.BOND}`
      },
      {
        name: 'harbor.withdraw.preview.delay',
        value: previewData.delay,
        timeSymbol: previewData.delay === '1' ? 'common.day' : 'common.days'
      }
    ]
  };
};
