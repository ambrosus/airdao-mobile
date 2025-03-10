import { useCallback, useState } from 'react';
import { Alert, StyleProp, View, ViewStyle } from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  SignInResponse,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes
} from '@react-native-google-signin/google-signin';
import { IProvider } from '@web3auth/base';
import { ethers } from 'ethers';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text } from '@components/base';
import { web3auth } from '@features/web3auth/instance';
import { scale } from '@utils';

function alert(message: string) {
  Alert.alert(message);
}

const parseToken = (credential: string) => {
  try {
    const token = credential.split('.')[1];
    return JSON.parse(atob(token));
  } catch (e) {
    console.error(e);
    return null;
  }
};

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

  const onWeb3Auth = useCallback(async (response: SignInResponse) => {
    try {
      const { idToken } = response.data ?? {};

      if (!idToken) return alert('Unable to parse idToken');

      const data = parseToken(idToken);

      const provider = await web3auth.connect({
        verifier,
        verifierId: data?.email,
        idToken: idToken!
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

    const { getSigner, getBalance } = new ethers.providers.Web3Provider(
      provider
    );

    const signer = getSigner();
    const address = await signer.getAddress();
    const balance = ethers.utils.formatEther(await getBalance(address));

    alert(address);
    alert(balance);
  };

  const logout = async () => {
    await web3auth.logout();
    await GoogleSignin.signOut();
  };

  return (
    <SafeAreaView style={containerStyles}>
      <View>
        <Text>OAuth</Text>

        <GoogleSigninButton onPress={signIn} />

        <Button onPress={logout}>
          <Text>Logout</Text>
        </Button>
        <Button onPress={getSigner}>
          <Text>Get Signer</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};
