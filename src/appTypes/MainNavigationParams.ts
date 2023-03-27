import { TabsParamsList } from '@navigation/stacks/TabsNavigator';
import { WalletsParamsList } from '@navigation/stacks/Tabs/WalletsStack';

// will add all stack types
export type MainNavigationParams = TabsParamsList & WalletsParamsList;
