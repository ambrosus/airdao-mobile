type BaseResult = { transactionHash?: string; error?: { message: string } };

export async function resultHandler<T extends BaseResult>(result: T) {
  if (result?.error || !result?.transactionHash)
    return { error: result?.error?.message || 'unknown' };

  return { transactionHash: result?.transactionHash };
}
