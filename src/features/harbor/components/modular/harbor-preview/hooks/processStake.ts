import { harborService } from '@api/harbor/harbor-service';
import { parseEther } from 'ethers/lib/utils';
import { IsNullableAccount } from '@entities/wallet/model/types';
import { explorerService } from '@api/explorer-service';
import { ProccessModel } from '@features/harbor/hooks/parseDataHelpers/models';

export const processStake = async (
  wallet: IsNullableAccount,
  amount: string
): Promise<ProccessModel | null> => {
  try {
    const result = await harborService.processStake(
      wallet?._raw,
      parseEther(amount || '0')
    );
    if (result) {
      if (result?.error || !result?.transactionHash) {
        return { error: result.error.message || 'unknown' };
      } else {
        const transaction = await explorerService.getTransactionDetails(
          result?.transactionHash || ''
        );
        return { transaction };
      }
    } else return null;
  } catch (e) {
    return { error: e };
  }
};
