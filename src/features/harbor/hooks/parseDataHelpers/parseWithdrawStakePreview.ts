import { CryptoCurrencyCode } from '@appTypes';
import { WithdrawPreviewDataModel } from '@features/harbor/components/harbor-preview/model';
import { NumberUtils } from '@utils';

export const parseWithdrawStakePreview = (
  previewData: WithdrawPreviewDataModel
) => {
  return {
    form: [
      {
        name: 'harbor.withdraw.amount',
        value: NumberUtils.limitDecimalCount(previewData.withdrawAmount, 2),
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
        // TODO: Update translation key after implementing network fee support
        name: 'swap.bottom.sheet.lpfee',
        value: `${0} ${CryptoCurrencyCode.AMB}`
      }
    ],
    success: [
      {
        title: true,
        name: 'harbor.withdraw.preview.success.header',
        symbol: CryptoCurrencyCode.stAMB,
        value: NumberUtils.limitDecimalCount(previewData.withdrawAmount, 2)
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
