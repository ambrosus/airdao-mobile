import { WithdrawPreviewDataModel } from '@features/harbor/components/harbor-preview/model';
import { CryptoCurrencyCode } from '@appTypes';
import { COLORS } from '@constants/colors';

export const parseWithdrawReward = (previewData: WithdrawPreviewDataModel) => {
  return {
    form: [
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
        textStyle: { color: COLORS.neutral900, fontSize: 24 },
        value: ''
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
