import { BigNumber } from 'ethers';
import { HarborDataModel } from '@entities/harbor/model/types';

export const DEFAULT_DATA = {
  apr: '0',
  totalStaked: BigNumber.from(0),
  stakeLimit: BigNumber.from(0),
  userStaked: BigNumber.from(0)
};

type ParseDataModel = Awaited<(string | any)[]>[];

export const parseData = (data: ParseDataModel): HarborDataModel => {
  const res = DEFAULT_DATA;

  data
    .map((item) => {
      if (item[0] && item[1]) {
        // @ts-ignore
        res[item[0]] = item[1];
      }
    })
    .filter((item) => item);
  return res as HarborDataModel;
};
