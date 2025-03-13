import { parseStakeData } from './parseStakeData';
import { parseWithdrawReward } from './parseWithdrawReward';
import { parseWithdrawStakePreview } from './parseWithdrawStakePreview';

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
