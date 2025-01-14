import '@walletconnect/react-native-compat';

import { Alert } from 'react-native';
import { WalletKit, IWalletKit } from '@reown/walletkit';
import { Core } from '@walletconnect/core';
import Constants from 'expo-constants';
import { getMetadata } from '../utils/misc/metadata';

export let walletKit: IWalletKit;

Alert.alert('envs', JSON.stringify(Constants.expoConfig?.extra?.eas));

export async function createWalletKit() {
  const core = new Core({
    projectId: Constants.expoConfig?.extra?.eas.REOWN_PROJECT_ID,
    relayUrl: 'wss://relay.walletconnect.org'
  });

  walletKit = await WalletKit.init({
    core,
    metadata: getMetadata()
  });

  try {
    Alert.alert(
      'Wallet kit instance',
      walletKit ? 'wallet kit exists' : 'unknown'
    );
    const clientId =
      await walletKit.engine.signClient.core.crypto.getClientId();

    console.warn('WalletConnect ClientID:', clientId);
  } catch (error) {
    console.error('Failed to get clientId', error);
  }
}

export async function updateSignClientChainId(
  chainId: string,
  address: string
) {
  // get most recent session
  const sessions = walletKit.getActiveSessions();
  if (!sessions) {
    return;
  }
  const namespace = chainId.split(':')[0];
  for (const session of Object.values(sessions)) {
    await walletKit.updateSession({
      topic: session.topic,
      namespaces: {
        ...session.namespaces,
        [namespace]: {
          ...session.namespaces[namespace],
          chains: [
            ...new Set(
              [chainId].concat(
                Array.from(session.namespaces[namespace].chains || [])
              )
            )
          ],
          accounts: [
            ...new Set(
              [`${chainId}:${address}`].concat(
                Array.from(session.namespaces[namespace].accounts)
              )
            )
          ]
        }
      }
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const chainChanged = {
      topic: session.topic,
      event: {
        name: 'chainChanged',
        data: parseInt(chainId.split(':')[1], 10)
      },
      chainId: chainId
    };

    const accountsChanged = {
      topic: session.topic,
      event: {
        name: 'accountsChanged',
        data: [`${chainId}:${address}`]
      },
      chainId
    };
    await walletKit.emitSessionEvent(chainChanged);
    await walletKit.emitSessionEvent(accountsChanged);
  }
}
