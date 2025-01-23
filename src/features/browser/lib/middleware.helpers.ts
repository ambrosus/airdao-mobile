/* eslint-disable no-console */
// tslint:disable:no-console
import { useBrowserStore } from '@entities/browser/model';
import { AMB_CHAIN_ID_HEX } from '@features/browser/constants';
import {
  REVOKE_PERMISSIONS_JS,
  UPDATE_ETHEREUM_STATE_JS
} from '@features/browser/lib';
import { rpcErrorHandler, requestUserApproval } from '@features/browser/utils';
import { rpcMethods } from './rpc-methods';

const {
  getCurrentAddress,
  handleSendTransaction,
  handleSignTransaction,
  signMessage,
  _signTypedData
} = rpcMethods;

export const ethRequestAccounts = async ({
  response,
  privateKey,
  webViewRef
}: any) => {
  const { connectedAddress, setConnectedAddress } = useBrowserStore.getState();
  console.log('eth_requestAccounts called');
  const address = await getCurrentAddress(privateKey);
  if (!address) {
    throw new Error('No account available');
  }
  try {
    if (address.toLowerCase() !== connectedAddress?.toLowerCase()) {
      response.result = [address];
      setConnectedAddress(address);

      // Delay the state update to prevent loops
      setTimeout(() => {
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript(
            UPDATE_ETHEREUM_STATE_JS(address, AMB_CHAIN_ID_HEX)
          );
        }
      }, 100);
    } else {
      response.result = [address];
    }
  } catch (e: unknown) {
    rpcErrorHandler('eth_requestAccounts', e);
  }
};

export const walletRequestPermissions = async ({
  permissions,
  response,
  privateKey,
  webViewRef
}: any) => {
  const { connectedAddress, setConnectedAddress } = useBrowserStore.getState();
  try {
    if (permissions?.eth_accounts) {
      const address = await getCurrentAddress(privateKey);
      if (!address) {
        throw new Error('No account available');
      }

      if (address.toLowerCase() !== connectedAddress?.toLowerCase()) {
        setConnectedAddress(address);

        setTimeout(() => {
          if (webViewRef.current) {
            webViewRef.current.injectJavaScript(
              UPDATE_ETHEREUM_STATE_JS(address, AMB_CHAIN_ID_HEX)
            );
          }
        }, 100);
      }

      response.result = [
        {
          parentCapability: 'eth_accounts',
          date: Date.now(),
          caveats: [
            {
              type: 'restrictReturnedAccounts',
              value: [address]
            }
          ]
        },
        {
          parentCapability: 'endowment:permitted-chains',
          date: Date.now(),
          caveats: [
            {
              type: 'restrictChains',
              value: [AMB_CHAIN_ID_HEX]
            }
          ]
        }
      ];
    } else {
      response.error = {
        code: 4200,
        message: 'Requested permission is not available'
      };
    }
  } catch (e) {
    rpcErrorHandler('walletRequestPermissions', e);
  }
};

export const walletRevokePermissions = async ({
  permissions,
  response,
  webViewRef
}: any) => {
  const { connectedAddress, setConnectedAddress } = useBrowserStore.getState();
  try {
    if (permissions?.eth_accounts) {
      if (connectedAddress) {
        setConnectedAddress('');

        setTimeout(() => {
          if (webViewRef.current) {
            webViewRef.current.injectJavaScript(REVOKE_PERMISSIONS_JS);
          }
        }, 100);
      }

      response.result = [
        {
          parentCapability: 'endowment:permitted-chains',
          date: Date.now(),
          caveats: [
            {
              type: 'restrictChains',
              value: [AMB_CHAIN_ID_HEX]
            }
          ]
        }
      ];
    } else if (permissions?.['endowment:permitted-chains']) {
      response.error = {
        code: 4200,
        message: 'Chain permissions cannot be revoked'
      };
    } else {
      response.error = {
        code: 4200,
        message: 'Permission to revoke is not recognized'
      };
    }
  } catch (e) {
    rpcErrorHandler('walletRevokePermissions', e);
  }
};

export const walletGetPermissions = async ({ response }: any) => {
  const { connectedAddress } = useBrowserStore.getState();
  try {
    const basePermissions = [
      {
        parentCapability: 'endowment:permitted-chains',
        date: Date.now(),
        caveats: [
          {
            type: 'restrictChains',
            value: [AMB_CHAIN_ID_HEX]
          }
        ]
      }
    ];

    if (connectedAddress) {
      response.result = [
        {
          parentCapability: 'eth_accounts',
          date: Date.now(),
          caveats: [
            {
              type: 'restrictReturnedAccounts',
              value: [connectedAddress]
            }
          ]
        },
        ...basePermissions
      ];
    } else {
      response.result = basePermissions;
    }
  } catch (e) {
    rpcErrorHandler('walletGetPermissions', e);
  }
};

export const ethSendTransaction = async ({
  params,
  response,
  privateKey
}: any) => {
  try {
    const txParams = params[0];
    await new Promise((resolve, reject) => {
      requestUserApproval({
        header: 'Confirm Transaction',
        message:
          `Do you want to send this transaction? From: ${txParams.from}\n` +
          `To: ${txParams.to}\n` +
          `Value: ${txParams.value || '0'} Wei\n` +
          `Data: ${txParams.data || 'None'}`,
        resolve: () => resolve(true),
        reject: () => reject(new Error('User rejected transaction'))
      });
    });

    response.result = await handleSendTransaction(txParams, privateKey);
  } catch (error) {
    rpcErrorHandler('eth_sendTransaction', error);
    throw error;
  }
};

export const ethSignTransaction = async ({
  params,
  response,
  privateKey
}: any) => {
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

export const personalSing = async ({ params, response, privateKey }: any) => {
  const { connectedAddress } = useBrowserStore.getState();
  try {
    console.log('Personal sign request:', params);
    const [message, address] = params;

    if (address.toLowerCase() !== connectedAddress?.toLowerCase()) {
      throw new Error('Address mismatch');
    }

    const userConfirmation = new Promise((resolve, reject) => {
      requestUserApproval({
        header: 'Sign Message',
        message: 'Do you want to sign this message?',
        resolve: () => resolve(true),
        reject: () => reject(new Error('User rejected signing'))
      });
    });

    await userConfirmation;

    const signature = await signMessage(message, privateKey);

    console.log('Signature generated:', signature);
    response.result = signature;
  } catch (error) {
    console.error('Personal sign error:', error);
    throw error;
  }
};

export const ethSignTypesData = async ({
  params,
  response,
  privateKey
}: any) => {
  const { connectedAddress } = useBrowserStore.getState();
  try {
    console.log('Sign typed data request:', params);
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

    const signature = await _signTypedData(data, privateKey);

    console.log('Signature generated:', signature);
    response.result = signature;
  } catch (error) {
    console.error('Failed to sign typed data:', error);
    throw error;
  }
};
