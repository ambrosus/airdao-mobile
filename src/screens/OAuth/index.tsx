import { Alert, StyleProp, View, ViewStyle } from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton
} from '@react-native-google-signin/google-signin';
import {
  AppleAuthenticationButtonType,
  AppleAuthenticationButtonStyle,
  AppleAuthenticationButton
} from 'expo-apple-authentication';
import { SafeAreaView } from 'react-native-safe-area-context';
import { custom, createWalletClient, formatEther } from 'viem';
import { Button, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { AUTH_ENVIRONMENT } from '@entities/oauth/utils';
import { useAuth, web3auth } from '@features/oauth/lib';
import { Network } from '@features/oauth/types';
import { createNetworkProvider } from '@lib/providers';
import { scale } from '@utils';

function alert(message: string) {
  Alert.alert(message);
}

GoogleSignin.configure({
  webClientId: AUTH_ENVIRONMENT.firebaseClientId
});

const containerStyles: StyleProp<ViewStyle> = {
  flex: 1,
  justifyContent: 'space-between',
  padding: scale(20),
  backgroundColor: COLORS.neutral100
};

const cardStyle: StyleProp<ViewStyle> = {
  backgroundColor: COLORS.neutral0,
  borderRadius: scale(12),
  padding: scale(16),
  shadowColor: COLORS.neutral800,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
  marginBottom: scale(16)
};

const headerStyle: StyleProp<ViewStyle> = {
  marginBottom: scale(16),
  borderBottomWidth: 1,
  borderBottomColor: COLORS.neutral200,
  paddingBottom: scale(8)
};

const buttonContainerStyle: StyleProp<ViewStyle> = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: scale(10)
};

export const OAuthScreen = () => {
  const { user, handleUserLogin, handleUserLogout } = useAuth();

  const getSigner = async () => {
    if (!web3auth.provider) return alert('Provider not found');

    const publicClient = createNetworkProvider();
    const provider = web3auth.provider;

    const walletClient = createWalletClient({
      transport: custom(provider)
    });

    const publicKey = await walletClient.getAddresses();
    alert(`Public key, ${JSON.stringify(publicKey)}`);

    const balance = await publicClient.getBalance({
      address: publicKey[0]
    });
    alert(`Balance, ${formatEther(balance)}`);
  };

  const logout = async () => {
    await web3auth.logout();
    await handleUserLogout(Network.APPLE);
  };

  return (
    <SafeAreaView style={containerStyles}>
      <View>
        <Text
          fontSize={24}
          fontFamily="Inter_700Bold"
          color={COLORS.neutral800}
          style={{ textAlign: 'center', marginBottom: scale(20) }}
        >
          {user ? `Welcome ${user}` : 'Connect your account'}
        </Text>

        <View style={cardStyle}>
          <View style={headerStyle}>
            <Text
              fontSize={20}
              fontFamily="Inter_700Bold"
              color={COLORS.neutral800}
            >
              Auth Services
            </Text>
          </View>

          <View style={{ alignItems: 'center' }}>
            <GoogleSigninButton
              onPress={() => handleUserLogin(Network.GOOGLE)}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              style={{ width: 240, height: 48 }}
            />

            <Spacer value={scale(16)} />

            <AppleAuthenticationButton
              onPress={() => handleUserLogin(Network.APPLE)}
              buttonType={AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={8}
              style={{ width: 240, height: 48 }}
            />
          </View>
        </View>

        <View style={cardStyle}>
          <View style={headerStyle}>
            <Text
              fontSize={18}
              fontFamily="Inter_600SemiBold"
              color={COLORS.neutral800}
            >
              Provider Methods
            </Text>
          </View>

          <View style={buttonContainerStyle}>
            <Button
              onPress={getSigner}
              style={{
                flex: 1,
                marginRight: scale(8),
                backgroundColor: COLORS.brand600,
                borderRadius: scale(8),
                padding: scale(12)
              }}
            >
              <Text color={COLORS.neutral0} fontFamily="Inter_500Medium">
                Get Signer
              </Text>
            </Button>

            <Button
              onPress={() =>
                alert(
                  GoogleSignin.getCurrentUser()?.user.email ?? 'No user found'
                )
              }
              style={{
                flex: 1,
                marginLeft: scale(8),
                backgroundColor: COLORS.brand600,
                borderRadius: scale(8),
                padding: scale(12)
              }}
            >
              <Text color={COLORS.neutral0} fontFamily="Inter_500Medium">
                Current User
              </Text>
            </Button>
          </View>
        </View>
      </View>

      <Button
        onPress={logout}
        style={{
          backgroundColor: COLORS.error600,
          borderRadius: scale(8),
          padding: scale(14),
          alignItems: 'center',
          marginTop: scale(20)
        }}
      >
        <Text color={COLORS.neutral0} fontFamily="Inter_600SemiBold">
          Logout
        </Text>
      </Button>
    </SafeAreaView>
  );
};
