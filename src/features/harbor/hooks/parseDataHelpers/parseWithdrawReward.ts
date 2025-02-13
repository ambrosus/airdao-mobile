import { CryptoCurrencyCode } from '@appTypes';
import { COLORS } from '@constants/colors';
import { WithdrawPreviewDataModel } from '@features/harbor/components/templates/harbor-preview/model';
import { NumberUtils } from '@utils';

export const parseWithdrawReward = (previewData: WithdrawPreviewDataModel) => {
  return {
    form: [
      {
        name: 'harbor.withdraw.preview.amb.reward',
        value: NumberUtils.limitDecimalCount(previewData.rewardAmb, 2),
        symbol: CryptoCurrencyCode.AMB
      },
      {
        name: 'harbor.withdraw.preview.bond.reward',
        value: NumberUtils.limitDecimalCount(previewData.rewardBond, 2),
        symbol: CryptoCurrencyCode.BOND
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
        value: `${NumberUtils.limitDecimalCount(previewData.rewardAmb, 2)} ${
          CryptoCurrencyCode.AMB
        }`
      },
      {
        name: 'harbor.withdraw.preview.bond.reward',
        value: `${NumberUtils.limitDecimalCount(previewData.rewardBond, 2)} ${
          CryptoCurrencyCode.BOND
        }`
      }
    ]
  };
};
