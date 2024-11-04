import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@screens/Wallets';
import { AMBMarket } from '@screens/AMBMarket';
import { Notifications } from '@screens/Notifications';
import { AssetScreen } from '@screens/Asset';
import { SendFunds, SendFundsStatus } from '@screens/SendFunds';
import { ImportWalletMethods } from '@screens/ImportWalletMethods';
import {
  ImportWallet,
  ImportWalletPrivateKey,
  ImportWalletPrivateKeyError,
  ImportWalletSuccess
} from '@screens/ImportWalletMethods/screens';
import { StakingPoolsScreen } from '@screens/StakingPools';
import { SendCryptoProvider } from '@contexts';
import {
  ConfirmPasscode,
  SetupPasscode,
  SuccessSetupSecurity
} from '@screens/SetupPasscode';
import { HomeParamsList } from '@appTypes/navigation/wallets';
import { getCommonStack } from '../CommonStack';
import { StakingPoolScreen } from '@screens/StakingPool';
import {
  StakeErrorScreen,
  StakeSuccessScreen
} from '@screens/StakingPool/screens';
import { NFTScreen } from '@screens/NFTScreen';
import { Bridge, BridgeTransferError } from '@screens/Bridge';
import { BridgeHistory } from '@screens/BridgeHistory';
import { SwapScreen } from '@screens/Swap';
import { SwapSettingsScreen } from '@screens/Swap/screens';
import { KosmosScreen } from '@screens/Kosmos';
import { KosmosMarketScreen } from '@screens/Kosmos/screens';
import {
  WalletConnectModal,
  WalletSessionsBottomSheet
} from '@features/wallet-connect/components/templates';

const Stack = createNativeStackNavigator<HomeParamsList>();
export const HomeStack = () => {
  return (
    // @ts-ignore
    <SendCryptoProvider>
      <>
        <Stack.Navigator
          initialRouteName="HomeScreen"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="AssetScreen" component={AssetScreen} />
          <Stack.Screen name="NFTScreen" component={NFTScreen} />
          <Stack.Screen name="AMBMarketScreen" component={AMBMarket} />
          <Stack.Screen name="ConfirmPasscode" component={ConfirmPasscode} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen
            name="ImportWalletSuccess"
            options={{ gestureEnabled: false }}
            component={ImportWalletSuccess}
          />
          <Stack.Screen name="Notifications" component={Notifications} />
          <Stack.Screen name="SendFunds" component={SendFunds} />
          <Stack.Screen
            name="SendFundsStatus"
            component={SendFundsStatus}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name="SetupPasscode" component={SetupPasscode} />
          <Stack.Screen name="StakingPool" component={StakingPoolScreen} />
          <Stack.Screen
            name="StakeSuccessScreen"
            component={StakeSuccessScreen}
          />
          <Stack.Screen name="StakeErrorScreen" component={StakeErrorScreen} />
          <Stack.Screen name="StakingPools" component={StakingPoolsScreen} />
          <Stack.Screen name="Bridge" component={Bridge} />
          <Stack.Screen
            name="BridgeTransferError"
            component={BridgeTransferError}
          />
          <Stack.Screen
            name="BridgeHistory"
            options={{
              presentation: 'fullScreenModal'
            }}
            component={BridgeHistory}
          />
          <Stack.Screen
            name="SuccessSetupSecurity"
            component={SuccessSetupSecurity}
          />
          <Stack.Screen
            name="ImportWalletMethods"
            component={ImportWalletMethods}
          />
          <Stack.Screen name="ImportWallet" component={ImportWallet} />
          <Stack.Screen
            name="ImportWalletPrivateKey"
            component={ImportWalletPrivateKey}
          />
          <Stack.Screen
            name="ImportWalletPrivateKeyError"
            component={ImportWalletPrivateKeyError}
          />
          <Stack.Screen name="SwapScreen" component={SwapScreen} />
          <Stack.Screen
            name="SwapSettingsScreen"
            component={SwapSettingsScreen}
          />
          <Stack.Screen name="KosmosScreen" component={KosmosScreen} />
          <Stack.Screen
            name="KosmosMarketScreen"
            component={KosmosMarketScreen}
          />
          {getCommonStack(Stack as any)}
        </Stack.Navigator>
        <WalletConnectModal />
        <WalletSessionsBottomSheet />
      </>
    </SendCryptoProvider>
  );
};

export default HomeStack;
