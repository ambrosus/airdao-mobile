import {
  StakePreviewDataModel,
  WithdrawPreviewDataModel
} from '@features/harbor/components/templates/harbor-preview/model';
import { parseStakeData } from './parseStakeData';
import { parseWithdrawReward } from './parseWithdrawReward';
import { parseWithdrawStakePreview } from './parseWithdrawStakePreview';

export const dataParseFunction = (
  type: string,
  data: StakePreviewDataModel | WithdrawPreviewDataModel
) => {
  switch (type) {
    case 'stake':
      return parseStakeData(data as StakePreviewDataModel);
    case 'withdraw-stake':
      return parseWithdrawStakePreview(data as WithdrawPreviewDataModel);
    case 'withdraw-reward':
      return parseWithdrawReward(data as WithdrawPreviewDataModel);
  }
};
