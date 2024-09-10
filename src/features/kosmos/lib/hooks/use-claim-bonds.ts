import { Dispatch, SetStateAction } from 'react';
// @ts-ignore
import { ContractNames, Methods } from '@airdao/airdao-bond';
import { TxType } from '@features/kosmos/types';
import { useBondContracts } from './use-bond-contracts';
import { useWallet } from '@hooks';
import { claimBond } from '../contracts';
import { useTransactions } from './use-transactions';

export function useClaimBonds(
  transaction: TxType,
  setIsOrderClaiming: Dispatch<SetStateAction<boolean>>
) {
  const { contracts } = useBondContracts();
  const { _extractPrivateKey } = useWallet();
  const { refetchTransactions } = useTransactions();

  const onClaimButtonPress = async (contractName: string) => {
    try {
      const { version, txHash, payoutToken, payoutAmount, vesting, eventId } =
        transaction;
      const privateKey = await _extractPrivateKey();

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
