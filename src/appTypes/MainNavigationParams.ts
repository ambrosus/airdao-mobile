import { TabsParamsList } from './navigation/tabs';
import { WalletsParamsList } from './navigation/wallets';

// will add all stack types
export type MainNavigationParams = TabsParamsList & WalletsParamsList;
