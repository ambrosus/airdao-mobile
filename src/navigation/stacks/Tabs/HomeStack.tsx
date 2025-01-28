import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeParamsList } from '@appTypes/navigation/wallets';
import { WalletSessionsBottomSheet } from '@features/wallet-connect/components/templates';
import { HarborStacks } from '@navigation/stacks/HarborStacks/HarborStacks';
import { AMBMarket } from '@screens/AMBMarket';
import { AssetScreen } from '@screens/Asset';
import { Bridge, BridgeTransferError } from '@screens/Bridge';
import { BridgeHistory } from '@screens/BridgeHistory';
import { KosmosOrderList } from '@screens/KosmosOrderList';
import { NFTScreen } from '@screens/NFTScreen';
import { Notifications } from '@screens/Notifications';
import { SendFunds } from '@screens/SendFunds';
import {
  StakeErrorScreen,
  StakeSuccessScreen
} from '@screens/StakingPool/screens';
import { StakingPoolsScreen } from '@screens/StakingPools';
import { SwapScreen } from '@screens/Swap';
import { SwapSettingsScreen } from '@screens/Swap/screens';
import { HomeScreen } from '@screens/Wallets';
import { getCommonStack } from '../CommonStack';

const Stack = createNativeStackNavigator<HomeParamsList>();
export const HomeStack = () => {
  return (
    <>
      <Stack.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="AssetScreen" component={AssetScreen} />
        <Stack.Screen name="NFTScreen" component={NFTScreen} />
        <Stack.Screen name="AMBMarketScreen" component={AMBMarket} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />

        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="SendFunds" component={SendFunds} />
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
        <Stack.Screen name="SwapScreen" component={SwapScreen} />
        <Stack.Screen
          name="SwapSettingsScreen"
          component={SwapSettingsScreen}
        />
        <Stack.Screen name="KosmosScreen" component={KosmosOrderList} />
        {/* HARBOR ROUTES */}
        <Stack.Screen name="Harbor" component={HarborStacks} />

        {getCommonStack(Stack as any)}
      </Stack.Navigator>
      <WalletSessionsBottomSheet />
    </>
  );
};

export default HomeStack;
