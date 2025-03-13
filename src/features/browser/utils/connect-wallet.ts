import { RefObject } from 'react';
import WebView from '@metamask/react-native-webview';
import Config from '@constants/config';

export const connectWallet = (
  address: string,
  webViewRef: RefObject<WebView>
) => {
  const updateScript = `
        (function() {
          try {
            if (window.ethereum) {
              window.ethereum.selectedAddress = '${address}';
              window.ethereum.selectedAddress = '${address}';
              window.ethereum.emit('accountsChanged', ['${address}']);
              window.ethereum.emit('connect', { chainId: '${Config.CHAIN_ID_HEX}' });
            }
          } catch(e) {
            console.error('Connection update error:', e);
          }
          return true;
        })();
      `;

  webViewRef?.current?.injectJavaScript(updateScript);
};
