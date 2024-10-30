import { HomeParamsList } from '@appTypes';

type AvailableProductsPath = keyof Pick<
  HomeParamsList,
  'SwapScreen' | 'Bridge' | 'StakingPools' | 'KosmosScreen'
>;

export type Product = {
  id: number;
  name: string;
  description: string;
  icon: JSX.Element;
  background: [string, string];
  color: string;
  route: AvailableProductsPath;
};

export type SectionizedProducts = {
  title: string;
  data: Product[];
};
