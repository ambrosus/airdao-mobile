import { Wallet } from '@models/Wallet';
import { DatabaseTable, WalletMetadata } from '@appTypes';
import AirDAOKeysStorage from '@lib/helpers/AirDAOKeysStorage';
import { Crypto } from './crypto';
import { MnemonicUtils } from './mnemonics';
import { CashBackUtils } from './cashback';
import { Database, WalletDBModel } from '@database';
import { AirDAOTransfer } from '@crypto/actions/AirDAOTransfer/AirDAOTransfer';
import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';
import AirDAOUtils from '@crypto/common/AirDAOUtils';
import { Q } from '@nozbe/watermelondb';
import AirDAOKeysForRef from '@lib/helpers/AirDAOKeysForRef';
import { Cache, CacheKey } from './cache';

const _saveWallet = async (
  wallet: Pick<WalletMetadata, 'newMnemonic' | 'mnemonic' | 'name' | 'number'>
) => {
  let storedKey = '';
  try {
    const prepared = {
      mnemonic: wallet.newMnemonic ? wallet.newMnemonic : wallet.mnemonic,
      hash: '?',
      number: wallet.number,
      name: wallet.name
    };

    prepared.mnemonic = MnemonicUtils.recheckMnemonic(prepared.mnemonic);
    prepared.hash = await Crypto.hashMnemonic(prepared.mnemonic);

    const checkKey = await AirDAOKeysStorage.isMnemonicAlreadySaved(prepared);
    if (checkKey) {
      // // TODO
    }
    storedKey = await AirDAOKeysStorage.saveMnemonic(prepared);
  } catch (e) {}
  return storedKey;
};

const _getWalletNumber = async () => {
  const count = (await Database.getCount(DatabaseTable.Wallets)) || 0;
  return count + 1;
};

const _getWalletName = async () => {
  const idx = await _getWalletNumber();
  return 'AirDAO Wallet #' + idx;
};

const processWallet = async (
  data: Pick<WalletMetadata, 'mnemonic' | 'name' | 'number'>
) => {
  const hash = await _saveWallet(data); // done
  let tmpWalletName = data.name;

  if (!tmpWalletName || tmpWalletName === '') {
    tmpWalletName = await _getWalletName();
  }
  const number = await _getWalletNumber();
  const fullWallet: Wallet = new Wallet({
    hash,
    ...data,
    name: tmpWalletName,
    number
  });
  const { tmpPublicAndPrivateResult, cashbackToken } =
    await CashBackUtils.getByHash(hash);
  fullWallet.cashback = cashbackToken;
  await Wallet.saveWallet(fullWallet);
  try {
  } catch (error) {
    throw error;
  }
  const { address } = tmpPublicAndPrivateResult;
  return { address };
};

const sendTx = async (
  walletHash: string,
  currencyCode: AirDAODictTypes.Code,
  from: string,
  to: string,
  etherAmount: number,
  accountBalanceRaw: string
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
      await AirDAOTransfer.sendTx(
        {
          currencyCode,
          walletHash: walletHash,
          derivationPath: info.path,
          addressFrom: from,
          addressTo: to,
          amount: AirDAOUtils.toWei(etherAmount).toString(),
          useOnlyConfirmed: Boolean(wallet.useUnconfirmed),
          allowReplaceByFee: Boolean(wallet.allowReplaceByFee),
          useLegacy: wallet.useLegacy,
          isHd: Boolean(wallet.isHd),
          accountBalanceRaw,
          isTransferAll: false
        },
        {
          uiErrorConfirmed: true,
          selectedFee: {
            langMsg: '',
            feeForTx: '',
            amountForTx: ''
          }
        }, // TODO fix selected fee
        // CACHE_DATA.additionalData
        {}
      );
    } catch (error) {
      throw error;
    }
  }
};

const changeSelectedWallet = async (hash: string) => {
  await Cache.setItem(CacheKey.SelectedWallet, hash);
};

export const WalletUtils = { processWallet, sendTx, changeSelectedWallet };
