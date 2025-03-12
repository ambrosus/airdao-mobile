import { HomeParamsList } from '@appTypes';
import { CustomAppEvents } from '@lib/firebaseEventAnalytics';

type AvailableProductsPath = keyof Pick<
  HomeParamsList,
  | 'SwapScreen'
  | 'Bridge'
  | 'StakingPools'
  | 'KosmosScreen'
  | 'Harbor'
  | 'BrowserScreen'
>;

export type Product = {
  id: number;
  section: string;
  name: string;
  description: string;
  icon: JSX.Element;
  background: [string, string];
  color: string;
  route: AvailableProductsPath | string;
  firebaseEvent: CustomAppEvents | '';
  isAirDaoApp?: boolean;
  uri?: string;
  platforms?: string[];
};

export type SectionizedProducts = {
  title: string;
  data: Product[];
};

export enum ProductSections {
  Trade = 'trade',
  Earn = 'earn',
  Web = 'web'
}
