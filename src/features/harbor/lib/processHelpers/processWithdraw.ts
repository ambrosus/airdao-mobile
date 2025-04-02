import { harborService } from '@api/harbor/harbor-service';
import { IsNullableAccount } from '@entities/wallet/model/types';
import { ProcessModel } from '@features/harbor/lib/parseDataHelpers/models';
import { resultHandler } from '@features/harbor/lib/processHelpers/resultHandler';

export const processWithdraw = async (
  wallet: IsNullableAccount,
  amount: string,
  desiredCoeff: number,
  { estimateGas = false }: { estimateGas?: boolean } = {}
): Promise<ProcessModel | null> => {
  const result = await harborService.processWithdraw(
    wallet?._raw,
    amount,
    desiredCoeff,
    { estimateGas }
  );

  if (estimateGas) {
    return result;
  }

  if (result) {
    return await resultHandler(result);
  } else return null;
};
