import { harborService } from '@api/harbor/harbor-service';
import { IsNullableAccount } from '@entities/wallet/model/types';
import { ProccessModel } from '@features/harbor/hooks/parseDataHelpers/models';
import { explorerService } from '@api/explorer-service';

export const processWithdraw = async (
  wallet: IsNullableAccount,
  amount: string,
  desiredCoeff: number
): Promise<ProccessModel | null> => {
  try {
    const result = await harborService.processWithdraw(
      wallet?._raw,
      amount,
      desiredCoeff
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
