import { HomeParamsList } from '@appTypes';
import { CustomAppEvents } from '@lib/firebaseEventAnalytics';

type AvailableProductsPath = keyof Pick<
  HomeParamsList,
  'SwapScreen' | 'Bridge' | 'StakingPools' | 'KosmosScreen' | 'Harbor'
>;

export type Product = {
  id: number;
  name: string;
  description: string;
  icon: JSX.Element;
  background: [string, string];
  color: string;
  route: AvailableProductsPath;
  firebaseEvent: CustomAppEvents;
};

export type SectionizedProducts = {
  title: string;
  data: Product[];
};
