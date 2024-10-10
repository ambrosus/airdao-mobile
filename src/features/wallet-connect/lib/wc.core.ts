import { WalletKit, IWalletKit } from '@reown/walletkit';
import { Core } from '@walletconnect/core';
import { getMetadata } from '../utils/misc/metadata';

export let walletKit: IWalletKit;

export async function createWalletKit() {
  const core = new Core({
    projectId: 'acecebc9ddf51f7ddddf1c582c076870',
    relayUrl: 'wss://relay.walletconnect.org'
  });

  walletKit = await WalletKit.init({
    core,
    metadata: getMetadata()
  });

  try {
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
  Object.values(sessions).forEach(async (session) => {
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
  });
}
