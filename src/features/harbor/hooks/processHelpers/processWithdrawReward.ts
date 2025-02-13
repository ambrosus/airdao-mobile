import { harborService } from '@api/harbor/harbor-service';
import { IsNullableAccount } from '@entities/wallet/model/types';
import { ProcessModel } from '@features/harbor/hooks/parseDataHelpers/models';
import { resultHandler } from '@features/harbor/hooks/processHelpers/resultHandler';

export const processWithdrawReward = async (
  wallet: IsNullableAccount,
  desiredCoeff: number,
  { estimateGas = false }: { estimateGas?: boolean } = {}
): Promise<ProcessModel | null> => {
  const result = await harborService.processClaimReward(
    wallet?._raw,
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
