import { parseEther } from 'ethers/lib/utils';
import { harborService } from '@api/harbor/harbor-service';
import { IsNullableAccount } from '@entities/wallet/model/types';
import { ProcessModel } from '@features/harbor/hooks/parseDataHelpers/models';
import { resultHandler } from '@features/harbor/hooks/processHelpers/resultHandler';

export const processStake = async (
  wallet: IsNullableAccount,
  amount: string,
  { estimateGas = false }: { estimateGas?: boolean } = {}
): Promise<ProcessModel | null> => {
  const result = await harborService.processStake(
    wallet?._raw,
    parseEther(amount || '0'),
    { estimateGas }
  );

  if (estimateGas) {
    return result;
  }

  if (result) {
    return await resultHandler(result);
  } else return null;
};
