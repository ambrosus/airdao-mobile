import { delay } from '@utils/delay';
import { explorerService } from '@api/explorer-service';

export const resultHandler = async (result: any) => {
  if (result?.error || !result?.transactionHash) {
    return { error: result?.error.message || 'unknown' };
  } else {
    await delay(1000);
    return explorerService
      .getTransactionDetails(result?.transactionHash || '')
      .then((transaction) => {
        return { transaction };
      })
      .catch(() => {
        return { processStatus: 'done' };
      });
  }
};
