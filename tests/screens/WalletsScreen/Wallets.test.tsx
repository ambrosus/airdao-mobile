import React from 'react';
import { render } from '@testing-library/react-native';
import { WalletsScreen } from '@screens/Wallets';
import * as ReactQuery from '@tanstack/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Data from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { VictoryTheme } from 'victory-native';
import axios from 'axios';
// import { Dimensions } from 'react-native/Libraries';
// jest.mock('react-native-gesture-handler', () => ({
//   PanGestureHandler: jest.fn()
// }));
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: jest.fn(),
    useRoute: jest.fn()
  };
});
//
// jest.mock('@tanstack/react-query', () => {
//   const original: typeof ReactQuery = jest.requireActual(
//     '@tanstack/react-query'
//   );
//   return {
//     ...original,
//     useQuery: () => ({ isLoading: false, error: {}, data: [] })
//   };
// });
//
// jest.mock('@hooks', () => ({
//   useAMBPrice: jest.fn(() => ({
//     data: 123123,
//     loading: false,
//     error: undefined
//   })),
//   usePersonalList: jest.fn(() => ({
//     personalList: []
//   }))
// }));
//
jest.mock('@contexts/OnBoardingUserContext', () => ({
  useOnboardingStatus: jest.fn(() => ({
    status: 'step-1'
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

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  const ReanimatedLayoutAnimation = {
    stiffness: jest.fn(() => ReanimatedLayoutAnimation),
    springify: jest.fn(() => ReanimatedLayoutAnimation),
    damping: jest.fn(() => ReanimatedLayoutAnimation),
    mass: jest.fn(() => ReanimatedLayoutAnimation),
    overshootClamping: jest.fn(() => ReanimatedLayoutAnimation),
    restDisplacementThreshold: jest.fn(() => ReanimatedLayoutAnimation),
    restSpeedThreshold: jest.fn(() => ReanimatedLayoutAnimation),
    duration: jest.fn(() => ReanimatedLayoutAnimation)
  };
  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.FadeIn = ReanimatedLayoutAnimation;
  Reanimated.FadeOut = ReanimatedLayoutAnimation;
  Reanimated.Layout = ReanimatedLayoutAnimation;
  Reanimated.FadeInRight = ReanimatedLayoutAnimation;

  Reanimated.default.call = () => {};
  Reanimated.__reanimatedWorkletInit = jest.fn();
  return Reanimated;
});

const mockIsPackageInstalled = jest.fn((value: string) => ({
  value,
  isInstalled: true
}));
jest.mock('react-native-share', () => ({
  isPackageInstalled: (value: string) => mockIsPackageInstalled(value),
  Social: { InstagramStories: 'instagramstories' }
}));

jest.mock('@helpers/createContextSelector', () => ({
  createContextSelector: () => [{}, jest.fn()]
}));
//
// const mockedSetClipboard = jest.fn();
// jest.mock('expo-clipboard', () => ({
//   setStringAsync: (text: string) => mockedSetClipboard(text)
// }));
// jest.mock('react-native-safe-area-context', () => ({
//   useSafeAreaInsets: () => ({
//     top: 0,
//     right: 0,
//     bottom: 0,
//     left: 0
//   })
// }));
//
// // jest.spyOn(Data, 'SafeAreaView').mockImplementation((props) => props.children);
// // jest.spyOn(Data, 'Dimensions', 'get').mockImplementation(() => ({
// //   get() {
// //     return { width: 320, height: 480 };
// //   }
// // }));
// // jest.spyOn(Data, 'SafeAreaView').mockImplementation((props) => props.children);
// // jest.spyOn(Data, 'SafeAreaView').mockImplementation((props) => props.children);
// // jest.spyOn(Data, 'SafeAreaView').mockImplementation((props) => props.children);
// // jest.spyOn(Data, 'SafeAreaView').mockImplementation((props) => props.children);
// // jest.spyOn(Data, 'SafeAreaView').mockImplementation((props) => props.children);
//
// // jest.spyOn(Dimensions, 'get').mockReturnValue(() => {});
//
// jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
//   get: jest.fn().mockReturnValue({ width: 1080, height: 1920 })
// }));
// jest.mock('react-native');
// () => ({
//   // SafeAreaView: jest.fn().mockImplementation(({ children }) => children),
//   Dimensions: {
//     get: jest.fn(() => ({ width: 320, height: 480 }))
//   },
//   useSafeAreaInsets: () => ({
//     top: 0,
//     right: 0,
//     bottom: 0,
//     left: 0
//   }),
// StyleSheet: {
//   create: jest.fn()
// }
//   Platform: {
//     OS: 'android'
//   }
// }));

// jest.mock('react-native-svg', () => ({
//   Svg: ({ chilren }) => <>{chilren}</>
// }));
//
// jest.mock('react-native-reanimated', () => ({
//   Easing: {
//     out: jest.fn(),
//     in: jest.fn()
//   },
//   useSharedValue: jest.fn(() => ({
//     value: 0,
//     interpolate: jest.fn()
//   })),
//   withTiming: jest.fn(),
//   withSpring: jest.fn(),
//   useAnimatedStyle: jest.fn(() => ({})),
//   addWhitelistedNativeProps: jest.fn(),
//   createAnimatedComponent: jest.fn()
// }));
// jest.mock('react-native-view-shot', () => ({
//   __esModule: true,
//   default: jest.fn()
// }));
// jest.mock('expo-sharing', () => ({
//   shareAsync: jest.fn()
// }));
//
// jest.mock('expo-secure-store', () => ({
//   getItemAsync: jest.fn(),
//   setItemAsync: jest.fn(),
//   deleteItemAsync: jest.fn()
// }));
// jest.mock('expo-crypto', () => ({
//   Crypto: {
//     digestStringAsync: jest.fn(),
//     digestStringUtf8Async: jest.fn()
//   }
// }));
//
// jest.mock('expo-camera', () => ({
//   Camera: {
//     requestPermissionsAsync: jest.fn(),
//     takePictureAsync: jest.fn()
//   }
// }));
//
// jest.mock('react-native-modal', () => ({
//   Modal: jest.fn()
// }));
//
// jest.mock('react-native-walkthrough-tooltip', () => {
//   const MockWalkthroughTooltip = jest.fn().mockReturnValue(null);
//   return {
//     __esModule: true,
//     default: MockWalkthroughTooltip
//   };
// });

jest.mock('react-native-safe-area-context', () => {
  // require('react-native-safe-area-context/jest/mock').default;
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset)
  };
});

// jest.mock('axios', () => ({
//   get: jest.fn(() => Promise.resolve({ data: { data: {} } }))
// }));

const queryClient = new QueryClient();

describe('WalletsScreen', () => {
  it('renders correctly', async () => {
    const { getByTestId } = render(
      // <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <WalletsScreen />
      </QueryClientProvider>
      // </SafeAreaProvider>
    );
    expect(getByTestId('wallets-screen')).toBeTruthy();
  });
});
//
// describe('WalletsScreen', () => {
//   it('renders PortfolioBalance with correct props', () => {
//     const ambTokenData = {
//       priceUSD: 1.23,
//       percentChange24H: 0.5
//     };
//     const personalList = [{ ambBalance: 100 }, { ambBalance: 200 }];
//     const { getByTestId } = render(<WalletsScreen />);
//     const portfolioBalance = getByTestId('portfolio-balance');
//     expect(portfolioBalance.props.USDBalance).toBe(ambTokenData.priceUSD * 300);
//     expect(portfolioBalance.props.AMBBalance).toBe(300);
//     expect(portfolioBalance.props.balanceLast24HourChange).toBe(3.46);
//     expect(portfolioBalance.props.AMBPriceLast24HourChange).toBe(
//       ambTokenData.percentChange24H
//     );
//     expect(portfolioBalance.props.AMBPrice).toBe(ambTokenData.priceUSD);
//   });
// });

// describe('WalletsScreen', () => {
//   it('renders OnboardingFloatButton with correct props', () => {
//     const { getByTestId } = render(<WalletsScreen />);
//     const onboardingFloatButton = getByTestId('onboarding-float-button');
//     expect(onboardingFloatButton.props.onboardingButtonTitle).toBe(
//       'Add a Address'
//     );
//     expect(
//       onboardingFloatButton.props.onboardingButtonIcon.type.displayName
//     ).toBe('AddIcon');
//   });
// });
