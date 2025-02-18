import { ModalActionTypes } from '@components/composite';
import { useBrowserStore } from '@entities/browser/model';
import { SignMessageParams } from '@features/browser/types';
import { requestUserApproval, rpcRejectHandler } from '@features/browser/utils';
import { rpcMethods } from '../rpc-methods';

export const personalSign = async ({
  params,
  response,
  browserApproveRef,
  privateKey
}: SignMessageParams) => {
  const { signMessage } = rpcMethods;

  const { connectedAddress } = useBrowserStore.getState();
  try {
    const [message, address] = params;

    if (address.toLowerCase() !== connectedAddress?.toLowerCase()) {
      throw new Error('Address mismatch');
    }

    const userConfirmation = new Promise((resolve, reject) => {
      requestUserApproval({
        browserApproveRef,
        modalType: ModalActionTypes.PERMISSIONS,
        selectedAddress: connectedAddress,
        resolve: () => resolve(true),
        reject: () => reject(new Error('User rejected signing'))
      });
    });

    await userConfirmation;

    response.result = await signMessage(message, privateKey);
  } catch (error) {
    response.error = rpcRejectHandler(4001, error);
  }
};
