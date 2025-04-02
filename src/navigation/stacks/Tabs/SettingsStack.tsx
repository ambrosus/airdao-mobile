import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingsTabParamsList } from '@appTypes';
import { AddressDetails } from '@screens/Address';
import {
  CreateWalletStep0,
  CreateWalletStep1,
  CreateWalletStep2
} from '@screens/CreateWallet';
import { ImportWalletMethods } from '@screens/ImportWalletMethods';
import {
  ImportWallet,
  ImportWalletPrivateKey
} from '@screens/ImportWalletMethods/screens';
import {
  AboutScreen,
  AccessKeysScreen,
  AppPreferencesScreen,
  ChangePasscode,
  HelpCenterScreen,
  ManageWalletsScreen,
  NotificationSettingsScreen,
  SecuritySettingsScreen,
  SettingsScreen,
  SingleWalletScreen
} from '@screens/Settings';
import { Explore } from '@screens/Settings/screens/Explore';
import { ManagePermissions } from '@screens/Settings/screens/ManagePermissions';
import { Watchlist } from '@screens/Settings/screens/Watchlist';
import {
  ConfirmPasscode,
  SetupPasscode,
  SuccessSetupSecurity
} from '@screens/SetupPasscode';
import { SingleGroupScreen } from '@screens/SingleCollection';

const Stack = createNativeStackNavigator<SettingsTabParamsList>();
export const SettingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="SettingsScreen"
    >
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="AppPreferences" component={AppPreferencesScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="ManageWallets" component={ManageWalletsScreen} />
      <Stack.Screen name="ManagePermissions" component={ManagePermissions} />
      <Stack.Screen name="Watchlist" component={Watchlist} />
      <Stack.Screen
        name="Explore"
        component={Explore}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen name="Address" component={AddressDetails} />
      <Stack.Screen name="Collection" component={SingleGroupScreen} />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
      />
      <Stack.Screen
        name="SecuritySettings"
        component={SecuritySettingsScreen}
      />
      <Stack.Screen name="ChangePasscode" component={ChangePasscode} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="SingleWallet" component={SingleWalletScreen} />
      <Stack.Screen name="AccessKeys" component={AccessKeysScreen} />
      <Stack.Screen name="CreateWalletStep0" component={CreateWalletStep0} />
      <Stack.Screen name="CreateWalletStep1" component={CreateWalletStep1} />
      <Stack.Screen name="CreateWalletStep2" component={CreateWalletStep2} />
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
        name="SetupPasscode"
        component={SetupPasscode}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name="ConfirmPasscode" component={ConfirmPasscode} />
      <Stack.Screen
        options={{ gestureEnabled: false }}
        name="SuccessSetupSecurity"
        component={SuccessSetupSecurity}
      />
    </Stack.Navigator>
  );
};

export default SettingsStack;
