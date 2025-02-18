import { requestUserApproval, rpcErrorHandler } from '@features/browser/utils';
import { rpcMethods } from '../rpc-methods';

export const ethSignTransaction = async ({
  params,
  response,
  privateKey
}: any) => {
  const { handleSignTransaction } = rpcMethods;

  try {
    const txParams = params[0];

    await new Promise((resolve, reject) => {
      requestUserApproval({
        header: 'Sign Transaction',
        message:
          `Do you want to send this transaction? From: ${txParams.from}\n` +
          `To: ${txParams.to}\n` +
          `Value: ${txParams.value || '0'} Wei\n` +
          `Data: ${txParams.data || 'None'}`,
        resolve: () => resolve(true),
        reject: () => reject(new Error('User rejected signing'))
      });
    });

    response.result = await handleSignTransaction(txParams, privateKey);
  } catch (error) {
    rpcErrorHandler('eth_sendTransaction', error);
    throw error;
  }
};
