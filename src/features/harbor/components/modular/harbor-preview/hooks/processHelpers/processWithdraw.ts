import { harborService } from '@api/harbor/harbor-service';
import { IsNullableAccount } from '@entities/wallet/model/types';
import { ProcessModel } from '@features/harbor/hooks/parseDataHelpers/models';
import { resultHandler } from '@features/harbor/components/modular/harbor-preview/hooks/processHelpers/resultHandler';

export const processWithdraw = async (
  wallet: IsNullableAccount,
  amount: string,
  desiredCoeff: number
): Promise<ProcessModel | null> => {
  const result = await harborService.processWithdraw(
    wallet?._raw,
    amount,
    desiredCoeff
  );
  if (result) {
    return await resultHandler(result);
  } else return null;
};
