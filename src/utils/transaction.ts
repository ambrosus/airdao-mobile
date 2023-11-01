import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';
import { Cache, CacheKey } from '@lib/cache';
import TransferDispatcher from '@lib/crypto/TransferDispatcher';
import { Token } from '@models';

const sendTx = async (
  walletHash: string,
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
      token.symbol !== AirDAODictTypes.Code.AMB ? token.address : undefined;
    await TransferDispatcher.sendTx(
      privateKey,
      to,
      etherAmount.toString(),
      additionalData
    );
  } catch (error) {
    throw error;
  }
};

const getEstimatedFee = async (
  walletHash: string,
  to: string,
  etherAmount: number,
  token: Token
): Promise<number> => {
  // const wallets = (await Database.query(
  //   DatabaseTable.Wallets,
  //   Q.where('hash', Q.eq(walletHash))
  // )) as WalletDBModel[];
  // if (wallets.length > 0) {
  // const wallet = wallets[0];
  try {
    // const info = await AirDAOKeysForRef.discoverPublicAndPrivate({
    //   mnemonic: wallet.mnemonic
    // });
    const privateKey = (await Cache.getItem(
      `${CacheKey.WalletPrivateKey}-${walletHash}`
    )) as string;
    if (!privateKey) throw Error('PRIVATE_KEY_NOT_FOUND');
    const additionalData =
      token.symbol !== AirDAODictTypes.Code.AMB ? token.address : undefined;
    return await TransferDispatcher.getEstimatedFee(
      privateKey,
      to,
      etherAmount.toString(),
      additionalData
    );
  } catch (error) {
    throw error;
  }
  // } else {
  //   throw Error('Invalid wallet hash');
  // }
};

export const TransactionUtils = { sendTx, getEstimatedFee };
