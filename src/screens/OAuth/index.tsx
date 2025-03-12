import '@ethersproject/shims';
import { useCallback, useEffect, useState } from 'react';
import { Alert, StyleProp, View, ViewStyle } from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  SignInResponse,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes
} from '@react-native-google-signin/google-signin';
import { ADAPTER_EVENTS, IProvider } from '@web3auth/base';
import { decodeToken } from '@web3auth/single-factor-auth';
import { ethers } from 'ethers';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text } from '@components/base';
import { web3auth } from '@features/web3auth/instance';
import { scale } from '@utils';

function alert(message: string) {
  Alert.alert(message);
}

const verifier = process.env.W3A_IDENTIFIER ?? '';

GoogleSignin.configure({
  webClientId: process.env.FIREBASE_OAUTH_CLIENT_ID
});

const containerStyles: StyleProp<ViewStyle> = {
  flex: 1,
  padding: scale(20)
};

export const OAuthScreen = () => {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.init();
        setProvider(web3auth.provider);

        if (web3auth.status === ADAPTER_EVENTS.CONNECTED) {
          alert('Provider created!');
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const onWeb3Auth = useCallback(async (response: SignInResponse) => {
    try {
      const { idToken } = response.data ?? {};

      if (!idToken) return alert('Unable to parse idToken');

      const { payload } = decodeToken(idToken);

      const provider = await web3auth.connect({
        verifier,
        verifierId: (payload as any).email,
        idToken
      });

      alert('Provider successfully created!');
      setProvider(provider);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const signIn = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        setEmail(response.data?.user.email ?? null);
        onWeb3Auth(response);
      } else {
        alert('sign in was cancelled by user');
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            alert('operation (eg. sign in) already in progress');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            alert('Android only, play services not available or outdated');
            break;
          default:
        }
      }
    }
  }, [onWeb3Auth]);

  const getSigner = async () => {
    if (!provider) return alert('Provider not found');

    const web3Provider = new ethers.providers.Web3Provider(provider);

    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();
    const balance = ethers.utils.formatEther(
      await web3Provider.getBalance(address)
    );

    alert(address);
    alert(balance);
  };

  const logout = async () => {
    try {
      await GoogleSignin.signOut();
      await web3auth.logout();

      setEmail(null);
    } catch (e) {
      console.error(e);
    } finally {
      alert('Logged out');
    }
  };

  return (
    <SafeAreaView style={containerStyles}>
      <View>
        <Text>{email ? `Welcome ${email}` : 'OAuth'}</Text>

        <GoogleSigninButton onPress={signIn} />

        <Button onPress={logout}>
          <Text>Logout</Text>
        </Button>
        <Button onPress={getSigner}>
          <Text>Get Signer</Text>
        </Button>
        <Button
          onPress={() =>
            alert(GoogleSignin.getCurrentUser()?.user.email ?? 'No user found')
          }
        >
          <Text>Get Current User</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};
