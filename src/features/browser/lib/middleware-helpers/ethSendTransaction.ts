import { RPCRequestWithTransactionParams } from '@features/browser/types';
import { requestUserApproval, rpcErrorHandler } from '@features/browser/utils';
import { rpcMethods } from '../rpc-methods';

export const ethSendTransaction = async ({
  params: [txParams],
  response,
  privateKey
}: RPCRequestWithTransactionParams) => {
  const { handleSendTransaction } = rpcMethods;

  try {
    await new Promise<void>((resolve, reject) => {
      requestUserApproval({
        header: 'Confirm Transaction',
        message:
          `Do you want to send this transaction? From: ${txParams.from}\n` +
          `To: ${txParams.to}\n` +
          `Value: ${txParams.value || '0'} Wei\n` +
          `Data: ${txParams.data || 'None'}`,
        resolve: () => resolve(),
        reject: () => reject(new Error('User rejected transaction'))
      });
    });

    response.result = await handleSendTransaction(txParams, privateKey);
  } catch (error) {
    rpcErrorHandler('eth_sendTransaction', error);
    throw error;
  }
};
