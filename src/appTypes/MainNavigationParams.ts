import { TabsParamsList } from './navigation/tabs';
import { HomeParamsList } from './navigation/wallets';

// will add all stack types
export type MainNavigationParams = TabsParamsList & HomeParamsList;
