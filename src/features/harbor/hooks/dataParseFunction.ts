import {
  parseStakeData,
  parseWithdrawReward,
  parseWithdrawStakePreview
} from './parseDataHelpers';

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
