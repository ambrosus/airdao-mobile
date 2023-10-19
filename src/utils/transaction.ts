import { DatabaseTable } from '@appTypes';
import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';
import { Database, WalletDBModel } from '@database';
import TransferDispatcher from '@lib/crypto/TransferDispatcher';
import AirDAOKeysForRef from '@lib/helpers/AirDAOKeysForRef';
import { Token } from '@models';
import { Q } from '@nozbe/watermelondb';

const sendTx = async (
  walletHash: string,
  to: string,
  etherAmount: number,
  token: Token
) => {
  const wallets = (await Database.query(
    DatabaseTable.Wallets,
    Q.where('hash', Q.eq(walletHash))
  )) as WalletDBModel[];
  if (wallets.length > 0) {
    const wallet = wallets[0];
    try {
      const info = await AirDAOKeysForRef.discoverPublicAndPrivate({
        mnemonic: wallet.mnemonic
      });
      const additionalData =
        token.symbol !== AirDAODictTypes.Code.AMB ? token.address : undefined;
      await TransferDispatcher.sendTx(
        info.privateKey,
        to,
        etherAmount.toString(),
        additionalData
      );
    } catch (error) {
      throw error;
    }
  }
};

const getEstimatedFee = async (
  walletHash: string,
  to: string,
  etherAmount: number,
  token: Token
): Promise<number> => {
  const wallets = (await Database.query(
    DatabaseTable.Wallets,
    Q.where('hash', Q.eq(walletHash))
  )) as WalletDBModel[];
  if (wallets.length > 0) {
    const wallet = wallets[0];
    try {
      const info = await AirDAOKeysForRef.discoverPublicAndPrivate({
        mnemonic: wallet.mnemonic
      });
      const additionalData =
        token.symbol !== AirDAODictTypes.Code.AMB ? token.address : undefined;
      return await TransferDispatcher.getEstimatedFee(
        info.privateKey,
        to,
        etherAmount.toString(),
        additionalData
      );
    } catch (error) {
      throw error;
    }
  } else {
    throw Error('Invalid wallet hash');
  }
};

export const TransactionUtils = { sendTx, getEstimatedFee };
