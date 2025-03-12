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
import {
  AppleAuthenticationButtonType,
  AppleAuthenticationButtonStyle,
  signInAsync,
  AppleAuthenticationScope,
  AppleAuthenticationButton
} from 'expo-apple-authentication';
import Constants from 'expo-constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { web3auth } from '@features/web3auth/instance';
import { scale } from '@utils';

function alert(message: string) {
  Alert.alert(message);
}

const verifier = Constants.expoConfig?.extra?.eas.W3A_IDENTIFIER ?? '';

GoogleSignin.configure({
  webClientId: Constants.expoConfig?.extra?.eas.FIREBASE_OAUTH_CLIENT_ID
});

const containerStyles: StyleProp<ViewStyle> = {
  flex: 1,
  justifyContent: 'space-between',
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

  const onAppleAuth = async () => {
    try {
      const credential = await signInAsync({
        requestedScopes: [
          AppleAuthenticationScope.FULL_NAME,
          AppleAuthenticationScope.EMAIL
        ]
      });
      alert(JSON.stringify(credential));
      // signed in
    } catch (e) {
      if ((e as { code: string }).code === 'ERR_REQUEST_CANCELED') {
        alert('User canceled the sign-in flow');
      } else {
        alert('Error signing in');
      }
    }
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

        <View>
          <Text
            fontSize={20}
            fontFamily="Inter_700Bold"
            color={COLORS.neutral800}
          >
            Auth Services
          </Text>
          <Spacer value={scale(10)} />
          <GoogleSigninButton onPress={signIn} />

          <Spacer value={scale(10)} />
          <AppleAuthenticationButton
            onPress={onAppleAuth}
            buttonType={AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={5}
            style={{ width: '60%', height: 50 }}
          />
        </View>

        <Spacer value={scale(20)} />

        <View>
          <Text
            fontSize={16}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral800}
          >
            Provider Methods
          </Text>
          <Spacer value={scale(10)} />

          <Button onPress={getSigner}>
            <Text>Get Signer</Text>
          </Button>
          <Button
            onPress={() =>
              alert(
                GoogleSignin.getCurrentUser()?.user.email ?? 'No user found'
              )
            }
          >
            <Text>Get Current User</Text>
          </Button>
        </View>
      </View>
      <Button onPress={logout}>
        <Text>Logout</Text>
      </Button>
    </SafeAreaView>
  );
};
