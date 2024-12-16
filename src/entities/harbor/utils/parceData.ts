import { HarborDataModel } from '@entities/harbor/model/types';
import { DEFAULT_DATA } from '@entities/harbor/constants';

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
