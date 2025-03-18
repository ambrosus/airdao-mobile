import {
  GoogleSignin,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes
} from '@react-native-google-signin/google-signin';
import { decodeToken } from '@web3auth/single-factor-auth';
import {
  signInAsync,
  AppleAuthenticationScope,
  signOutAsync
} from 'expo-apple-authentication';
import { AUTH_ENVIRONMENT } from '@entities/oauth/utils';
import { web3auth } from './web3auth.core';
import { IDecodedPayload } from '../types';
import { $error } from '../utils';

class OAuth {
  private decodeToken = <T extends keyof IDecodedPayload>(
    idToken: string
  ): Pick<IDecodedPayload, T> => {
    return decodeToken<Pick<IDecodedPayload, T>>(idToken).payload;
  };

  loginApple = async () => {
    try {
      const { identityToken: idToken } = await signInAsync({
        requestedScopes: [
          AppleAuthenticationScope.FULL_NAME,
          AppleAuthenticationScope.EMAIL
        ]
      });

      if (!idToken) return $error('idToken');

      const verifier = AUTH_ENVIRONMENT.apple.provider;
      const { email: verifierId, sub } = this.decodeToken<'email' | 'sub'>(
        idToken
      );

      return {
        sub,
        provider: await web3auth.connect({
          verifier,
          verifierId,
          idToken
        })
      };
    } catch (error) {
      throw error;
    }
  };

  loginGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const idToken = response.data.idToken;
        if (!idToken) return $error('idToken');

        const verifier = AUTH_ENVIRONMENT.google.provider;
        const { email: verifierId, sub } = this.decodeToken<'email' | 'sub'>(
          idToken
        );

        return {
          sub,
          provider: await web3auth.connect({
            verifier,
            verifierId,
            idToken
          })
        };
      } else {
        $error('canceled');
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            $error('loading');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            $error('playServices');
            break;
          default:
        }
      }
    }
  };

  logoutApple = async (user: string) => {
    try {
      await signOutAsync({ user });
    } catch (error) {
      throw error;
    }
  };

  logoutGoogle = async () => {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      throw error;
    }
  };
}

export const oAuth = new OAuth();
