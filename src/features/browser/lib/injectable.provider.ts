import WebView from '@metamask/react-native-webview';
import { randomUUID } from 'expo-crypto';
import Config from '@constants/config';
import { isIos } from '@utils';
import { EIP6963_PROVIDER_INFO } from './eip6963';

const uuid = randomUUID;

export const updateWindowObject = (
  webViewRef: React.RefObject<WebView>,
  object: string
) => {
  setTimeout(() => {
    webViewRef.current?.injectJavaScript(object);
  }, 100);
};

export const INJECTED_JS = `
  (function() {
    if (window.ethereum) return true;

    let isInitialized = false;
    let requestCounter = 0;
    const pendingRequests = new Map();
    let lastEmittedState = {
      address: null,
      chainId: null,
      connected: false
    };
    let isHandlingRequest = false;  // Add lock for request handling

    // EIP-6963
    const eip6963ProviderInfo = {
      uuid: '${uuid()}',
      name: '${EIP6963_PROVIDER_INFO.name}',
      icon: '${EIP6963_PROVIDER_INFO.icon}',
      rdns: '${EIP6963_PROVIDER_INFO.rdns}'
    };

    // Create the provider object
    const provider = {
      isMetaMask: true,
      selectedAddress: null,
      chainId: '${Config.CHAIN_ID_HEX}',
      networkVersion: ${Config.CHAIN_ID},
      _events: new Map(),

      isConnected: () => true,
      _metamask: {
        isUnlocked: () => true,
      },

      request: function(args) {
        return new Promise((resolve, reject) => {
          const { method, params } = args;
          const id = requestCounter++;

          // Prevent duplicate eth_accounts requests
          if (method === 'eth_accounts') {
            if (isHandlingRequest) {
              return resolve(this.selectedAddress ? [this.selectedAddress] : []);
            }
            isHandlingRequest = true;
            setTimeout(() => { isHandlingRequest = false; }, 1000); // Reset lock after 1s
          }

          // Special handling for eth_requestAccounts
          if (method === 'eth_requestAccounts' && this.selectedAddress) {
            return resolve([this.selectedAddress]);
          }

          pendingRequests.set(id, { resolve, reject });

          window.ReactNativeWebView.postMessage(JSON.stringify({
            id,
            jsonrpc: '2.0',
            method,
            params: params || []
          }));
        });
      },

      on: function(eventName, callback) {
        if (!this._events.has(eventName)) {
          this._events.set(eventName, new Set());
        }
        this._events.get(eventName).add(callback);

        // Only emit initial state if there's an actual change
        if (this.selectedAddress &&
            this.selectedAddress !== lastEmittedState.address &&
            !isHandlingRequest) {
          switch(eventName) {
            case 'connect':
              if (!lastEmittedState.connected) {
                callback({ chainId: this.chainId });
                lastEmittedState.connected = true;
              }
              break;
            case 'accountsChanged':
              if (this.selectedAddress !== lastEmittedState.address) {
                callback([this.selectedAddress]);
                lastEmittedState.address = this.selectedAddress;
              }
              break;
            case 'chainChanged':
              if (this.chainId !== lastEmittedState.chainId) {
                callback(this.chainId);
                lastEmittedState.chainId = this.chainId;
              }
              break;
          }
        }

        return () => this._events.get(eventName).delete(callback);
      },

      emit: function(eventName, data) {
        // Prevent duplicate emissions
        switch(eventName) {
          case 'connect':
            if (lastEmittedState.connected) return;
            lastEmittedState.connected = true;
            break;
          case 'accountsChanged':
            const newAddress = Array.isArray(data) ? data[0] : null;
            if (newAddress === lastEmittedState.address) return;
            lastEmittedState.address = newAddress;
            break;
          case 'chainChanged':
            if (data === lastEmittedState.chainId) return;
            lastEmittedState.chainId = data;
            break;
        }

        const listeners = this._events.get(eventName);
        if (listeners) {
          listeners.forEach(listener => {
            try {
              listener(data);
            } catch(e) {
              console.error('Event listener error:', e);
            }
          });
        }
      },

      removeListener: function(eventName, callback) {
        if (this._events.has(eventName)) {
          this._events.get(eventName).delete(callback);
        }
      },

      enable: function() {
        return this.request({ method: 'eth_requestAccounts' });
      },

      info: eip6963ProviderInfo,

      announceProvider: function() {
        window.dispatchEvent(
          new CustomEvent('eip6963:announceProvider', {
            detail: {
              info: this.info,
              provider: this
            }
          })
        );
      }
    };

    function eventHandler(event) {
      try {
        const response = JSON.parse(event.data);
        const { id, result, error } = response;

        console.log('RN Message received',{id, result, error})

        const pendingRequest = pendingRequests.get(id);
        if (pendingRequest) {
          pendingRequests.delete(id);

          if (error) {
            pendingRequest.reject(error);
          } else {
            if (response.method === 'eth_requestAccounts' || response.method === 'eth_accounts') {
              if (result && result[0] !== provider.selectedAddress) {
                provider.selectedAddress = result[0];
                const listeners = provider._events.get('accountsChanged');
                if (listeners) {
                  listeners.forEach(listener => listener(result));
                }
              }
            }
            pendingRequest.resolve(result);
          }
        }
      } catch (error) {
        console.error('Failed to process message:', error);
      }
    }

    // for Android: document.addEventListener('message', eventHandler);
    // for IOS: window.addEventListener('message', eventHandler);

    {{listener}}('message', eventHandler)

    window.ethereum = provider;

    if (!isInitialized) {
      isInitialized = true;
      provider.announceProvider();
      window.addEventListener('eip6963:requestProvider', function() {
        provider.announceProvider();
      });
      window.dispatchEvent(new Event('ethereum#initialized'));

      // Get the title of the page and send it to React Native
    }
    window.addEventListener('load', function() {
      const title = document.title;
      window.ReactNativeWebView.postMessage(JSON.stringify({
        jsonrpc: '2.0',
        method: 'get_title',
        params: [title]
      }));
    });
    return true;
  })();
`;

export const INJECTED_PROVIDER_JS = INJECTED_JS.replace(
  '{{listener}}',
  isIos ? 'window.addEventListener' : 'document.addEventListener'
);

export const REVOKE_PERMISSIONS_JS = `
  (function() {
    try {
      if (window.ethereum) {
        window.ethereum.selectedAddress = null;
        window.ethereum.emit('accountsChanged', []);
        console.log('Permissions revoked');
      }
    } catch(e) {
      console.error('Revoke permissions error:', e);
    }
    return true;
  })();
`;

export const UPDATE_ETHEREUM_STATE_JS = (address: string, chainId: string) => `
  (function() {
    try {
      if (window.ethereum) {
        window.ethereum.selectedAddress = '${address}';
        window.ethereum.chainId = '${chainId}';

        window.ethereum.emit('connect', { chainId: '${chainId}' });
        window.ethereum.emit('chainChanged', '${chainId}');
        window.ethereum.emit('accountsChanged', ['${address}']);

        console.log('Ethereum state updated:', {
          address: '${address}',
          chainId: '${chainId}'
        });
      }
    } catch(e) {
      console.error('State update error:', e);
    }
    return true;
  })();
`;
