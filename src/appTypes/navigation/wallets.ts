import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabsParamsList } from './tabs';
import { CommonStackParamsList } from './common';
import { StakingPool, Token } from '@models';
import { ReturnedPoolDetails } from '@api/staking/types';
import { AccountDBModel } from '@database';

export type HomeParamsList = {
  HomeScreen: undefined;
  AMBMarketScreen: undefined;
  Notifications: undefined;
  NFTScreen: {
    tokenInfo: Token;
    walletAccount: string;
  };
  AssetScreen: {
    tokenInfo: Token;
    walletAccount: string;
  };
  SendFunds: { token?: Token };
  SendFundsStatus: undefined;
  CreateWalletStep0: undefined;
  CreateWalletStep1: undefined;
  CreateWalletStep2: undefined;
  CreateWalletSuccess: undefined;
  SetupPasscode: undefined;
  ConfirmPasscode: { passcode: string[] };
  StakingPool: { pool: StakingPool };
  StakingPools: undefined;
  SuccessSetupSecurity: undefined;
  ImportWallet: undefined;
  ImportWalletSuccess: undefined;
  StakeSuccessScreen: {
    type: 'stake' | 'withdraw';
    pool: ReturnedPoolDetails | undefined;
    wallet: AccountDBModel | null;
  };
  StakeErrorScreen: undefined;
} & CommonStackParamsList;

export type HomeNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList, 'Wallets'>,
  NativeStackNavigationProp<HomeParamsList>
>;
