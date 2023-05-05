import React from 'react';
import { render } from '@testing-library/react-native';
import { WalletsScreen } from '@screens/Wallets';
import * as ReactQuery from '@tanstack/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePersonalList } from '@hooks';

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: jest.fn(),
    useRoute: jest.fn()
  };
});

jest.mock('@tanstack/react-query', () => {
  const original: typeof ReactQuery = jest.requireActual(
    '@tanstack/react-query'
  );
  return {
    ...original,
    useQuery: () => ({ isLoading: false, error: {}, data: [] })
  };
});

jest.mock('@hooks', () => ({
  useAMBPrice: jest.fn(() => ({
    data: 123123,
    loading: false,
    error: undefined
  })),
  usePersonalList: jest.fn(() => ({
    personalList: []
  }))
}));

jest.mock('@contexts/OnBoardingUserContext', () => ({
  useOnboardingStatus: jest.fn(() => ({
    status: 'step-1'
  }))
}));

jest.mock('@contexts/AllAddresses', () => ({
  useAllAddresses: jest.fn(() => ({}))
}));
jest.mock('victory-native', () => ({}));

jest.mock('react-native-share', () => ({}));

jest.mock('@helpers/createContextSelector', () => ({
  createContextSelector: () => [{}, jest.fn()]
}));

const queryClient = new QueryClient();

describe('WalletsScreen', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <WalletsScreen />
      </QueryClientProvider>
    );
    expect(getByTestId('wallets-screen')).toBeTruthy();
  });
});

describe('WalletsScreen', () => {
  it('renders PortfolioBalance with correct props', () => {
    const ambTokenData = {
      priceUSD: 1.23,
      percentChange24H: 0.5
    };
    const personalList = [{ ambBalance: 100 }, { ambBalance: 200 }];
    const { getByTestId } = render(<WalletsScreen />);
    const portfolioBalance = getByTestId('portfolio-balance');
    expect(portfolioBalance.props.USDBalance).toBe(ambTokenData.priceUSD * 300);
    expect(portfolioBalance.props.AMBBalance).toBe(300);
    expect(portfolioBalance.props.balanceLast24HourChange).toBe(3.46);
    expect(portfolioBalance.props.AMBPriceLast24HourChange).toBe(
      ambTokenData.percentChange24H
    );
    expect(portfolioBalance.props.AMBPrice).toBe(ambTokenData.priceUSD);
  });
});

describe('WalletsScreen', () => {
  it('renders OnboardingFloatButton with correct props', () => {
    const { getByTestId } = render(<WalletsScreen />);
    const onboardingFloatButton = getByTestId('onboarding-float-button');
    expect(onboardingFloatButton.props.onboardingButtonTitle).toBe(
      'Add a Address'
    );
    expect(
      onboardingFloatButton.props.onboardingButtonIcon.type.displayName
    ).toBe('AddIcon');
  });
});
