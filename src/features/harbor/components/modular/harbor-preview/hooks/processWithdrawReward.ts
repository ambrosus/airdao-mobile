import { harborService } from '@api/harbor/harbor-service';
import { IsNullableAccount } from '@entities/wallet/model/types';
import { explorerService } from '@api/explorer-service';

export const processWithdrawReward = async (
  wallet: IsNullableAccount,
  desiredCoeff: number
) => {
  try {
    const result = await harborService.processClaimReward(
      wallet?._raw,
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
