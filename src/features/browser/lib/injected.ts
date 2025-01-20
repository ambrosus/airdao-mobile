export const injectedJavaScript = `
(function () {
  if (window.ethereum) {
    console.log('Ethereum provider already injected.');
    return;
  }

  // Define the Ethereum provider object
  const ethereum = {
    isMetaMask: false,
    
    // Network information (Mainnet or custom network)
    chainId: '0x414e',  // Example custom chainId, change based on actual network
    networkVersion: '16718', // Example custom networkVersion

    // Request method compliant with EIP-1193
    request: async ({ method, params }) => {
      return new Promise((resolve, reject) => {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ method, params })
        );

        const handleMessage = (event) => {
          try {
            const response = JSON.parse(event.data);
            if (response.method === method) {
              window.removeEventListener('message', handleMessage);
              
              if (response.error) {
                reject(response.error);
              } else {
                resolve(response.result);
              }
            }
          } catch (error) {
            window.removeEventListener('message', handleMessage);
            reject(error);
          }
        };
      
        window.addEventListener('message', handleMessage);
      });
    },

    // EIP-6693 connect method
    connect: async (options) => {
      return new Promise((resolve, reject) => {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ method: 'connect', params: options })
        );

        const handleMessage = (event) => {
          try {
            const response = JSON.parse(event.data);
            if (response.method === 'connect') {
              window.removeEventListener('message', handleMessage);
              
              if (response.error) {
                reject(response.error);
              } else {
                resolve(response.result);
              }
            }
          } catch (error) {
            window.removeEventListener('message', handleMessage);
            reject(error);
          }
        };
      
        window.addEventListener('message', handleMessage);
      });
    }
  };

  // Attach the Ethereum provider to the global window object
  window.ethereum = ethereum;
})();
`;
