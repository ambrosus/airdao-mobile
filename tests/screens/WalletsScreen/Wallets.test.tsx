import React from 'react';
import { render } from '@testing-library/react-native';
import { WalletsScreen } from '@screens/Wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

jest.mock('@contexts/OnBoardingUserContext', () => ({
  useOnboardingStatus: jest.fn(() => ({
    status: 'step-1'
  }))
}));

jest.mock('@hooks', () => ({
  useForwardedRef: jest.fn(),
  useFullscreenModalHeight: () => [],
  useAMBPrice: jest.fn(() => ({
    data: {
      _id: '123123',
      id: 123,
      name: '123123',
      symbol: '123',
      circulatingSupply: 123123,
      maxSupply: null,
      totalSupply: 123123,
      rank: 123,
      percentChange1H: 123,
      percentChange24H: 123,
      percentChange7D: 123,
      priceUSD: 123,
      volumeUSD: 3333,
      marketCapUSD: 111
    },
    loading: false,
    error: undefined
  })),
  usePersonalList: jest.fn(() => ({
    personalList: [
      {
        _id: '123123',
        address: '123123123',
        ambBalance: 100,
        transactionCount: 1,
        type: 'account',
        name: 'asdasdasd'
      }
    ]
  }))
}));

jest.mock('@contexts/AllAddresses', () => ({
  useAllAddresses: jest.fn(() => {
    return [];
  }),
  useAllAddressesReducer: jest.fn()
}));

jest.mock('victory-native', () => {
  return {
    VictoryChart: jest.fn(),
    VictoryTheme: {},
    VictoryLine: jest.fn(),
    VictoryAxis: jest.fn()
  };
});

const queryClient = new QueryClient();

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <WalletsScreen />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};
describe('WalletsScreen', () => {
  it('renders correctly', async () => {
    const { getByTestId } = render(<Component />);
    expect(getByTestId('wallets-screen')).toBeTruthy();
  });

  it('renders PortfolioBalance with correct props', () => {
    const { getByTestId } = render(<Component />);
    const portfolioBalance = getByTestId('Portfolio_Balance_Title');
    expect(portfolioBalance.props.children).toEqual(['$', '12,300.00']);
    const usdBalance = getByTestId('Portfolio_Balance_USDBalance');
    expect(usdBalance.props.children).toBeTruthy();
  });

  it('renders OnboardingFloatButton with correct props', () => {
    const { getByTestId } = render(<Component />);
    const onboardingFloatButton = getByTestId('onboarding-float-button');
    const onboardingFloatButtonTitle = getByTestId('Float_Button_Title');
    expect(onboardingFloatButtonTitle.props.children).toEqual('Add a Address');
    expect(onboardingFloatButton).toBeTruthy();
  });
});
