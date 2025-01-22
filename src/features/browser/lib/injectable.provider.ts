export const INJECTED_PROVIDER_JS = `
  const consoleLog = (type, log) => window.ReactNativeWebView.postMessage(JSON.stringify({'type': 'Console', 'data': {'type': type, 'log': log}}));
  console = {
      log: (log) => consoleLog('log', log),
      debug: (log) => consoleLog('debug', log),
      info: (log) => consoleLog('info', log),
      warn: (log) => consoleLog('warn', log),
      error: (log) => consoleLog('error', log),
    };
  (function() {
    if (window.ethereum) return;
    
    let isInitialized = false;
    let requestCounter = 0;
    const pendingRequests = new Map();

    // EIP-6963
    const providerInfo = {
      uuid: 'c7df86fd-339b-4d51-8ad6-6a600535d86a',
      name: 'AMB Wallet',
      icon: 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAAChCAMAAAB3TUS6AAAAAXNSR0IArs4c6QAAAwBQTFRFR3BMapTzVYPqSnjmZI/wV4XrZ5LxY47wWofsUoHpVoTrTnvnZZDwVILqYY3vaJPyXoruXYrtbJbzT3zoRXTkSHflUH3oa5Xzbpj0UYDpQ3LjXIntdpz3dp/4THrnWYbscZv1P3DiR3blOm3gX4joc5z2cJr1Zo/xXovudJ33QXHjeJ/2PG7gQ3PkaJPyaZPySHbleqH7apPyU4LoaJLyWYbreKD4eqL6QHDfdZ73Z5HwZI7vapTycJf1eJ/2cJn0bZb0N2rfSHjlSHfkZI7wOmzgOWzgXIjsaJHxbpb0WYbsc5r2cZr1WYbsR3flW4fscJj0cJj0b5n0d575aJHxaZTybpj1N2recpr1SHfleJ/2P3DhbJX0Om3fOGvfSHjldp33eJ/3e6L5TXznbZbzeaH4U4HqPGzfT37oOGreeqD4aZLxdZz2WobtUH7oeKD4O27gcJj1RHXje6L5d533VoPpUYDnY43uRnblYYzuQ3PjXInsVYPrUYDoYIzuUH/oYY3vPnDhXYntN2rfX4zvP2/heaH4dJv2bJXzPW7gOmzdc5v2e6L4fqT6faL5SXnlYYzuVYPqSnnlVoLpSXbkUoDoPW/gT33oZY7vWYTrZZDwZY/waJLxSXnmO23fYYzuZpDwWobsXIjsYIvuTHvmZI7vVIHpW4fsWYXrZY/vUH7oS3rmX4ruUX/oaJLxZ5HwYo3uVYLpUoDoVoPqXYnta5TyRXXjZY/wQ3TjRnbkV4TqY47vcJj0U4DpXontPW/haJHxSXjlWITqSHjkaZLxc5v1QXLibJXyTXzmR3fkcZn1X4vuSnnlbpfzQHHhZpHxaZPyYIzvY43vTnznXYjsYo3vT33nOmzfbZbzYIvtTXvnP3Dhb5f0WIXrXortapPxYozuapPyTn3neJ/4PG7ge6L5QnPiOGreV4Pqcpr1Z5Dwdp33Q3PiNmneeqH4W4frd573WYbrXIfsdZz2VoLqOWvfdJz2eaD4bJXzPW7hZZDwUn/oVILpZo/wXonsYIrtxp3BSwAAAQB0Uk5TAP7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/iD+/v7+/v7+EP7+IP7+/jD+IG+//hBgIDD+/v4Qf39AkEDv/n/+f0Cvf19f31B/37+fX9+f7/5foN9w36+fYN+fn2/v34/v3++fb0C/v4Dv7+Tfz/nfv1D6QJBw35Dev+9Q57fv7+8w33i/59/PkLdvf9+Qv7/P33Dfr+7fz+/Pn6/v/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////xQbD9oAABMCSURBVHja7VzpV9vnlRYghARCQuwGb9gGC9vxVoOTNGnWttk62ZNmT5pmkkx60pPkdJ85p5329LQ9032WdjbJCAECg9iFWc1mwGaxAWM4NsLgBYMJNth4wyHzPPcn5/TLfEPS74Pfv+Cee+/z3Ofe+76vRnP73D63z+1z+/w/Z/Nmddv3zu6r76xUsX3/cubM7NVv3aVa+1Z+a3Z29uqpVW+qNc7fPSMGnlp1UZ1xfvmMGHg1++KqzDdfVqGBv929e/dsNj14PvPSpTdXqjAF6cKrSMJVmZmX2tvfUp2JK383m00DT108f/5Sevvax59Vm4U7vpl9dTZ71arz589npl9pXzv1hOqc+A+z2dmnaOElGDiVcfDg/aqzECG+yBy80t4+NXWwPuOjnWojG+bgxczMK+3pa+HB+vrkp1QW581fuSg8097efjAD9p3oGb5fdRYiB2EfYlyf0ZPcMzz8q0dVZmGmeBA5CBee6DkR21H1qqrivPk7QHF6ezty8GBP8onh2NiqkOe3qstCocGDUwfvq69HiJM6qqrGn9+oIgvvTZcQZxDFycMdHR1VIWPmtv9WkYkv+3Iwo74HHuxIqho3H27TPaIiUrzrytp0RjgZKAZIqsbG20pK+oyPqMeJb6VnACTP1PcAJPBgSMhYiVs3bffcs0E1AjuDOdjTkzw8HJuUVDU2VlKis9tvGP+iljivfHwtUpAWEiMhY23mErfbfsPjjHhYJXHeNSW1uGe44xocaG4rMevEwLp+093qsPAF5GAyUBwrKGkr2Y8c/Mzl9JhMpl98XRUWPgH/fZGDZnNJn73P49LW1Z002RzfUEOcVz4NEMfGxg5fCxkbR4zdOpfLo40oLTXZRkb++TEVWPiohLhjGMV4HESo67PTgxGlNpvN4dj7i13Bt/ApKSQACVDctr9k2u4yaiP6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', 
      rdns: 'io.airdao.app'
    };

    // Create the provider object
    const provider = {
      isMetaMask: true,
      isConnected: () => true,
      _metamask: {
        isUnlocked: () => true,
      },
      selectedAddress: null,
      chainId: '0x414e',
      networkVersion: '16718',
      
      request: function(args) {
        return new Promise((resolve, reject) => {
          const { method, params } = args;
          const id = requestCounter++;
          
          pendingRequests.set(id, { resolve, reject });
          
          window.ReactNativeWebView.postMessage(JSON.stringify({
            id,
            jsonrpc: '2.0',
            method,
            params: params || []
          }));
        });
      },
      
      // Improved event handling system
      _events: new Map(),
      _lastEmittedState: {
        accounts: null,
        chainId: null,
        connected: false
      },
      
      on: function(eventName, callback) {
        if (!this._events.has(eventName)) {
          this._events.set(eventName, new Set());
        }
        this._events.get(eventName).add(callback);
        
        // Immediately emit current state for certain events
        // but only if it's different from last emitted state
        switch(eventName) {
          case 'accountsChanged':
            if (this.selectedAddress !== this._lastEmittedState.accounts) {
              const accounts = this.selectedAddress ? [this.selectedAddress] : [];
              this._lastEmittedState.accounts = this.selectedAddress;
              callback(accounts);
            }
            break;
          case 'chainChanged':
            if (this.chainId !== this._lastEmittedState.chainId) {
              this._lastEmittedState.chainId = this.chainId;
              callback(this.chainId);
            }
            break;
          case 'connect':
            if (this.isConnected() !== this._lastEmittedState.connected) {
              this._lastEmittedState.connected = this.isConnected();
              callback({ chainId: this.chainId });
            }
            break;
        }
        
        return () => this._events.get(eventName).delete(callback);
      },
      
      emit: function(eventName, data) {
        // Only emit if state has changed
        switch(eventName) {
          case 'accountsChanged':
            const accounts = Array.isArray(data) ? data[0] : null;
            if (accounts === this._lastEmittedState.accounts) return;
            this._lastEmittedState.accounts = accounts;
            break;
          case 'chainChanged':
            if (data === this._lastEmittedState.chainId) return;
            this._lastEmittedState.chainId = data;
            break;
          case 'connect':
            const connected = !!data;
            if (connected === this._lastEmittedState.connected) return;
            this._lastEmittedState.connected = connected;
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

      info: providerInfo,
      
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

    window.addEventListener('message', function(event) {
      try {
        const response = JSON.parse(event.data);
        const { id, result, error } = response;
        
        const pendingRequest = pendingRequests.get(id);
        if (pendingRequest) {
          pendingRequests.delete(id);
          
          if (error) {
            pendingRequest.reject(new Error(error.message));
          } else {
            if (response.method === 'eth_requestAccounts' || response.method === 'eth_accounts') {
              provider.selectedAddress = result[0];
              const listeners = provider._events.get('accountsChanged');
              if (listeners) {
                listeners.forEach(listener => listener(result));
              }
            }
            pendingRequest.resolve(result);
          }
        }
      } catch (error) {
        console.error('Failed to process message:', error);
      }
    });

    window.ethereum = provider;

    if (!isInitialized) {
      isInitialized = true;
      
      // Announce provider immediately
      provider.announceProvider();

      // Listen for provider requests
      window.addEventListener('eip6963:requestProvider', function() {
        provider.announceProvider();
      });

      // Dispatch ethereum#initialized for backward compatibility
      window.dispatchEvent(new Event('ethereum#initialized'));
    }
  })();
  `;
export const REVOKE_PERMISSIONS_JS = `
  (function() {
    try {
      if (window.ethereum) {
        // Update state
        window.ethereum.selectedAddress = null;
        
        // Emit single accountsChanged event
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
        // Update provider state
        window.ethereum.selectedAddress = '${address}';
        window.ethereum.chainId = '${chainId}';
        
        // Emit events only if state has changed
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
