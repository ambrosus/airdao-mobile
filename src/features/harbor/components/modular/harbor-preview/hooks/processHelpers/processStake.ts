import { harborService } from '@api/harbor/harbor-service';
import { parseEther } from 'ethers/lib/utils';
import { IsNullableAccount } from '@entities/wallet/model/types';
import { ProcessModel } from '@features/harbor/hooks/parseDataHelpers/models';
import { resultHandler } from '@features/harbor/components/modular/harbor-preview/hooks/processHelpers/resultHandler';

export const processStake = async (
  wallet: IsNullableAccount,
  amount: string
): Promise<ProcessModel | null> => {
  const result = await harborService.processStake(
    wallet?._raw,
    parseEther(amount || '0')
  );
  if (result) {
    return await resultHandler(result);
  } else return null;
};
