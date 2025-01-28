export const resultHandler = async (result: any) => {
  if (result?.error || !result?.transactionHash) {
    return { error: result?.error.message || 'unknown' };
  } else {
    return { transactionHash: result?.transactionHash };
  }
};
