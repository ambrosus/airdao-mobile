import { ethers } from 'ethers';
import { ModalActionTypes } from '@components/composite';
import Config from '@constants/config';
import { useBrowserStore } from '@entities/browser/model';
import { RPCRequestWithTransactionParams } from '@features/browser/types';
import { requestUserApproval, rpcErrorHandler } from '@features/browser/utils';
import { rpcMethods } from '../rpc-methods';

export const ethSendTransaction = async ({
  params: [txParams],
  response,
  privateKey,
  browserApproveRef
}: RPCRequestWithTransactionParams) => {
  const { handleSendTransaction } = rpcMethods;
  const { connectedAddress } = useBrowserStore.getState();

  try {
    const userConfirmation = new Promise((resolve, reject) => {
      requestUserApproval({
        browserApproveRef,
        modalType: ModalActionTypes.SEND_TRANSACTION,
        selectedAddress: connectedAddress,
        resolve: () => resolve(true),
        reject: () => reject(new Error('User rejected sending'))
      });
    });

    await userConfirmation;

    const provider = new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);
    const gasPrice = await provider.getGasPrice();

    response.result = await handleSendTransaction(
      { ...txParams, gasPrice },
      privateKey
    );
  } catch (error) {
    rpcErrorHandler('eth_sendTransaction', error);
    const err = error as { code?: number; message?: string; data?: unknown };

    response.error = {
      code: err.code ?? -32000,
      message: err.message ?? 'Transaction failed',
      ...(err.data ? { data: err.data } : {})
    };
  }
};
