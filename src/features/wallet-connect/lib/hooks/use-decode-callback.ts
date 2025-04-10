import { useCallback } from 'react';
import { ethers } from 'ethers';
import { StandardizedDecodedArgs } from '@features/wallet-connect/types';
import { PERSONAL_SIGN_MESSAGE } from '@features/wallet-connect/utils';
import { APPROVAL } from '@features/wallet-connect/utils/approval-abi';
import { useWalletConnectContextSelector } from './use-wallet-connect-context';

interface DecodedTransaction {
  functionName: string;
  decodedArgs: StandardizedDecodedArgs | null;
}

export function useDecodeCallbackData() {
  const { transaction, onChangeTransactionData } =
    useWalletConnectContextSelector();

  const standardizeDecodedArgs = (
    functionName: string,
    rawArgs: any
  ): StandardizedDecodedArgs => {
    switch (functionName) {
      case 'withdraw':
      case 'approve':
        return {
          addresses: [rawArgs.spender],
          gas: rawArgs.gas,
          amount: rawArgs.amount.toString()
        };

      case 'unstake':
      case 'stake': {
        const amount = rawArgs.value || rawArgs.amount || rawArgs[0];
        const spender = rawArgs.spender || rawArgs.to || rawArgs[1];
        const gas = rawArgs.gas || '0';

        return {
          addresses: [spender].filter(Boolean),
          gas: gas,
          amount: amount ? amount.toString() : '0'
        };
      }

      case 'buy':
      case 'sell': {
        return {
          addresses: [rawArgs.token, rawArgs[0]].filter(Boolean),
          amount: rawArgs.amount?.toString() || '0'
        };
      }

      case 'addLiquidityAMB':
      case 'removeLiquidityAMB':
        return {
          addresses: [rawArgs.token, rawArgs.to],
          amount:
            rawArgs.amountTokenDesired?.toString() ||
            rawArgs.liquidity?.toString(),
          deadline: rawArgs.deadline.toString()
        };
      // Swap functions
      default:
        if (functionName.startsWith('swap')) {
          return {
            amount: (
              rawArgs.amountIn ||
              rawArgs.amountOut ||
              rawArgs.amountOutMin
            ).toString(),
            gas: rawArgs.gas,
            addresses: rawArgs.path,
            deadline: rawArgs.deadline.toString()
          };
        }
        return {};
    }
  };

  const getTransactionParamsByBytes = useCallback(
    async (txData: string | undefined): Promise<DecodedTransaction | null> => {
      if (!txData) return null;

      // Handle regular transaction data
      const functionSignature = txData.slice(0, 10);

      const decodedTransaction: DecodedTransaction = {
        functionName: 'Unknown',
        decodedArgs: null
      };

      // Check if this is a personal_sign request
      if (txData[0].startsWith(PERSONAL_SIGN_MESSAGE)) {
        decodedTransaction.functionName = 'personal_sign';
        decodedTransaction.decodedArgs = {
          // @ts-ignore
          message: txData[0],
          from: txData[1]
        };

        onChangeTransactionData(decodedTransaction);
        return decodedTransaction;
      }

      try {
        const iface = new ethers.utils.Interface(APPROVAL);

        for (const func of APPROVAL) {
          const encodedSig = iface.getSighash(func.name);

          if (encodedSig === functionSignature) {
            const rawDecodedArgs = iface.decodeFunctionData(func.name, txData);

            decodedTransaction.functionName = func.name;
            decodedTransaction.decodedArgs = standardizeDecodedArgs(
              func.name,
              rawDecodedArgs
            );
            break;
          }
        }

        onChangeTransactionData(decodedTransaction);
        return decodedTransaction;
      } catch (error) {
        console.error('Failed to decode transaction:', error);
        console.error('Error details:', {
          message: (error as Error).message,
          stack: (error as Error).stack
        });
        return null;
      }
    },
    [onChangeTransactionData]
  );

  return {
    transaction,
    getTransactionParamsByBytes
  } as const;
}
