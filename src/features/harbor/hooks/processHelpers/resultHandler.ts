import { explorerService } from '@api/explorer-service';
import { delay } from '@utils';

export const resultHandler = async (result: any) => {
  if (result?.error || !result?.transactionHash) {
    return { error: result?.error.message || 'unknown' };
  } else {
    return { transactionHash: result?.transactionHash };
  }
};
