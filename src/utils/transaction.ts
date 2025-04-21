import { CryptoCurrencyCode } from '@appTypes';
import { Cache, CacheKey } from '@lib/cache';
import TransferDispatcher from '@lib/crypto/TransferDispatcher';
import { Token } from '@models';

const sendTx = async (
  walletHash: string,
  from: string,
  to: string,
  etherAmount: number,
  token: Token
) => {
  try {
    const privateKey = (await Cache.getItem(
      `${CacheKey.WalletPrivateKey}-${walletHash}`
    )) as string;
    if (!privateKey) throw Error('PRIVATE_KEY_NOT_FOUND');
    const additionalData =
      token.symbol !== CryptoCurrencyCode.ASC ? token.address : undefined;
    await TransferDispatcher.sendTx(
      privateKey,
      from,
      to,
      etherAmount.toString(),
      additionalData
    );
  } catch (error) {
    throw error;
  }
};

const getEstimatedFee = async (
  from: string,
  to: string,
  etherAmount: number,
  token: Token
): Promise<number> => {
  try {
    const additionalData =
      token.symbol !== CryptoCurrencyCode.ASC ? token.address : undefined;
    return await TransferDispatcher.getEstimatedFee(
      from,
      to,
      etherAmount.toString(),
      additionalData
    );
  } catch (error) {
    throw error;
  }
};

export const TransactionUtils = { sendTx, getEstimatedFee };
