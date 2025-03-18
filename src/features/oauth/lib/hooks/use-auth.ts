import { useCallback, useState } from 'react';
import { IProvider } from '@web3auth/base';
import { Network } from '@features/oauth/types';
import { $error } from '@features/oauth/utils';
import { oAuth } from '../oauth.core';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [user, setUser] = useState<string | null>(null);

  const handleUserLogin = useCallback(async (method: Network) => {
    try {
      setIsLoading(true);
      switch (method) {
        case Network.GOOGLE: {
          const response = await oAuth.loginGoogle();

          if (!response) return $error('failed');

          const { sub, provider } = response;

          setUser(sub);
          setProvider(provider);
          break;
        }
        case Network.APPLE: {
          const response = await oAuth.loginApple();

          if (!response) return $error('failed');

          const { sub, provider } = response;

          setUser(sub);
          setProvider(provider);
          break;
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUserLogout = useCallback(
    async (method: Network) => {
      try {
        switch (method) {
          case Network.APPLE: {
            await oAuth.logoutApple(user ?? '');
            break;
          }
          case Network.GOOGLE: {
            await oAuth.logoutGoogle();
            break;
          }
        }
        setUser(null);
        setProvider(null);
      } catch (error) {
        console.error(error);
      }
    },
    [user]
  );

  return {
    user,
    provider,
    isLoading,
    handleUserLogin,
    handleUserLogout
  };
}
