// @ts-ignore
import { ContractNames, Methods } from '@airdao/airdao-bond';
import { useBridgeContextData } from '@contexts/Bridge';
import { TxType } from '@features/kosmos/types';
import { useBondContracts } from './use-bond-contracts';
import { Cache, CacheKey } from '@lib/cache';
import { claimBond } from '../contracts';
import { Dispatch, SetStateAction } from 'react';
import { useTransactions } from './use-transactions';

export function useClaimBonds(
  transaction: TxType,
  setIsOrderClaiming: Dispatch<SetStateAction<boolean>>
) {
  const { contracts } = useBondContracts();
  const { selectedAccount } = useBridgeContextData();
  const { refetchTransactions } = useTransactions();

  const onClaimButtonPress = async (contractName: string) => {
    try {
      const { version, txHash, payoutToken, payoutAmount, vesting, eventId } =
        transaction;
      const privateKey = (await Cache.getItem(
        // @ts-ignore
        `${CacheKey.WalletPrivateKey}-${selectedAccount._raw?.hash}`
      )) as string;

      let idOrAddress = transaction.eventId;
      if (version === 'v1') {
        idOrAddress =
          contractName === ContractNames.FixedExpiryTeller
            ? await Methods.bondFixedExpiryTellerGetBondToken(
                contracts,
                contractName,
                payoutToken,
                vesting
              )
            : eventId;
      }

      // disableOrders = getFromLocalStorage('savedHashes');
      // disableOrders[hash] = true;
      // localStorage.setItem('savedHashes', JSON.stringify(disableOrders));
      const tx = await claimBond({
        contracts,
        contractName,
        arg1: String(idOrAddress),
        arg2: payoutAmount,
        hash: txHash,
        privateKey,
        version,
        setIsOrderClaiming
      });

      refetchTransactions();

      return tx;
    } catch (error) {
      throw error;
    }
  };

  return { onClaimButtonPress };
}
