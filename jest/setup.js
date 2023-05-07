import 'react-native-gesture-handler/jestSetup';

const mockIsPackageInstalled = jest.fn((value) => ({
  value,
  isInstalled: true
}));
jest.mock('react-native-share', () => ({
  isPackageInstalled: (value) => mockIsPackageInstalled(value),
  Social: { InstagramStories: 'instagramstories' }
}));

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: jest.fn(),
    useRoute: jest.fn()
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

jest.mock('react-native-safe-area-context', () => {
  // require('react-native-safe-area-context/jest/mock').default;
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset)
  };
});

jest.mock('@helpers/createContextSelector', () => ({
  createContextSelector: () => [{}, jest.fn()]
}));
