import { parseStakeData } from './parseStakeData';
import { parseWithdrawStakePreview } from './parseWithdrawStakePreview';
import { parseWithdrawReward } from './parseWithdrawReward';

export const dataParseFunction = (type: string, data: any) => {
  switch (type) {
    case 'stake':
      return parseStakeData(data);
    case 'withdraw-stake':
      return parseWithdrawStakePreview(data);
    case 'withdraw-reward':
      return parseWithdrawReward(data);
  }
};
