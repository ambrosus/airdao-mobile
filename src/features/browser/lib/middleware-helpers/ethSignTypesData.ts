import { useBrowserStore } from '@entities/browser/model';
import { SignTypedDataParams } from '@features/browser/types';
import { requestUserApproval } from '@features/browser/utils';
import { rpcMethods } from '../rpc-methods';

export const ethSignTypesData = async ({
  params,
  response,
  privateKey
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
        header: 'Sign Typed Data',
        message: `Do you want to sign this data?\n\nFrom: ${address}\n\nData: ${JSON.stringify(
          data,
          null,
          2
        )}`,
        resolve: () => resolve(true),
        reject: () => reject(new Error('User rejected signing'))
      });
    });
    await userConfirmation;

    response.result = await _signTypedData(data, privateKey);
  } catch (error) {
    console.error('Failed to sign typed data:', error);
    throw error;
  }
};
