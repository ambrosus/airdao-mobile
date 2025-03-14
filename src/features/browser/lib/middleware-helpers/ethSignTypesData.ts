import { ModalActionTypes } from '@components/composite';
import { useBrowserStore } from '@entities/browser/model';
import { SignTypedDataParams } from '@features/browser/types';
import { requestUserApproval } from '@features/browser/utils';
import { rpcMethods } from '../rpc-methods';

export const ethSignTypesData = async ({
  params,
  response,
  privateKey,
  browserApproveRef
}: SignTypedDataParams) => {
  const { _signTypedData } = rpcMethods;
  const { connectedAddress } = useBrowserStore.getState();

  try {
    const [address, typedData] = params;

    if (address.toLowerCase() !== connectedAddress?.toLowerCase()) {
      throw new Error('Address mismatch');
    }

    const data =
      typeof typedData === 'string' ? JSON.parse(typedData) : typedData;

    const userConfirmation = new Promise((resolve, reject) => {
      requestUserApproval({
        browserApproveRef,
        modalType: ModalActionTypes.PERSONAL_SIGN,
        selectedAddress: connectedAddress,
        resolve: () => resolve(true),
        reject: () => reject(new Error('User rejected signing'))
      });
    });

    await userConfirmation;
    response.result = await _signTypedData(data, privateKey);
  } catch (error) {
    console.error('Failed to sign typed data:', error);
  }
};
