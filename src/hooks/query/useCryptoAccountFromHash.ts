import { useCallback, useEffect, useState } from 'react';
import AirDAOKeysForRef from '@lib/helpers/AirDAOKeysForRef';
import { Database, WalletDBModel } from '@database';
import { DatabaseTable, ExplorerAccountType, QueryResponse } from '@appTypes';
import { Q } from '@nozbe/watermelondb';
import { ExplorerAccount } from '@models';
import { API } from '@api/api';
import { useTranslation } from 'react-i18next';

export const useCryptoAccountFromHash = (
  hash: string
): QueryResponse<ExplorerAccount | null> => {
  const [account, setAccount] = useState<ExplorerAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const getAccount = useCallback(async () => {
    setLoading(true);
    let wallets: WalletDBModel[];
    try {
      wallets = (await Database.query(
        DatabaseTable.Wallets,
        Q.where('hash', Q.eq(hash))
      )) as WalletDBModel[];
    } catch (error) {
      // TODO change text
      setError(t('errors.loading-wallet-from-db'));
      setLoading(true);
      return;
    }
    if (wallets?.length > 0) {
      const wallet = wallets[0];
      try {
        const _account = await AirDAOKeysForRef.discoverPublicAndPrivate({
          mnemonic: wallet.mnemonic
        });
        if (_account) {
          const balance = await API.cryptoService.getBalanceOfAddress(
            '0xb2E8A153bdbB5Ad7fc9c2e7F92BFA6908665664C'
          );
          const explorerAccount = new ExplorerAccount({
            _id: _account.address,
            address: _account.address,
            balance: {
              wei: balance.wei,
              ether: parseFloat(balance.ether)
            },
            byteCode: '',
            isContract: false,
            power: -1,
            role: -1,
            timestamp: -1,
            totalTx: -1,
            type: ExplorerAccountType.Account
          });
          setAccount(explorerAccount);
        }
      } catch (error) {
        // TODO change text
        setError(t('errors.loading-account'));
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [hash, t]);

  useEffect(() => {
    if (hash) getAccount();
  }, [getAccount, hash]);

  return { data: account, loading, error };
};
