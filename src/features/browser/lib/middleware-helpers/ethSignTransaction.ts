import { ModalActionTypes } from '@components/composite';
import { useBrowserStore } from '@entities/browser/model';
import { EthSignTransactionParams } from '@features/browser/types';
import { requestUserApproval, rpcErrorHandler } from '@features/browser/utils';
import { rpcMethods } from '../rpc-methods';

export const ethSignTransaction = async ({
  params,
  response,
  privateKey,
  browserApproveRef
}: EthSignTransactionParams) => {
  const { handleSignTransaction } = rpcMethods;
  const { connectedAddress } = useBrowserStore.getState();

  try {
    const txParams = params[0];

    const userConfirmation = new Promise((resolve, reject) => {
      requestUserApproval({
        browserApproveRef,
        modalType: ModalActionTypes.SEND_TRANSACTION,
        selectedAddress: connectedAddress,
        resolve: () => resolve(true),
        reject: () => reject(new Error('User rejected signing'))
      });
    });

    await userConfirmation;

    response.result = await handleSignTransaction(txParams, privateKey);
  } catch (error) {
    rpcErrorHandler('eth_sendTransaction', error);
    throw error;
  }
};
