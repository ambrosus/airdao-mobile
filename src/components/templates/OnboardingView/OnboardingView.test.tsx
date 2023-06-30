import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useOnboardingStatus } from '@contexts';
import { OnboardingView } from '@components/templates';
import { SafeAreaProvider } from 'react-native-safe-area-context';

jest.mock('@contexts');

const mockUseOnboardingStatus = useOnboardingStatus as jest.MockedFunction<
  typeof useOnboardingStatus
>;

describe('OnboardingView', () => {
  const mockRegisterHelpers = jest.fn();
  const mockBack = jest.fn();
  const mockNext = jest.fn();
  const mockSkip = jest.fn();

  beforeEach(() => {
    mockUseOnboardingStatus.mockReturnValue({
      status: 0,
      back: mockBack,
      next: mockNext,
      skip: mockSkip,
      registerHelpers: mockRegisterHelpers
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when isToolTipVisible is true', () => {
    const { getByTestId, getAllByTestId } = render(
      <SafeAreaProvider>
        <OnboardingView thisStep={0} />
      </SafeAreaProvider>
    );
    expect(getByTestId('Onboarding_View')).toBeTruthy();
    expect(getAllByTestId('Onboarding_Button')).toBeTruthy();
  });

  it('does not render when isToolTipVisible is false', () => {
    const { queryByTestId } = render(
      <SafeAreaProvider>
        <OnboardingView thisStep={1} />
      </SafeAreaProvider>
    );
    expect(queryByTestId('Onboarding_View')).toBeNull();
    expect(queryByTestId('Onboarding_Button')).toBeNull();
  });

  it('calls next function when button is pressed', () => {
    const { getAllByTestId } = render(
      <SafeAreaProvider>
        <OnboardingView thisStep={0} />
      </SafeAreaProvider>
    );
    const buttons = getAllByTestId('Onboarding_Button');
    fireEvent.press(buttons[0]);
    expect(mockNext).toHaveBeenCalledWith(0);
  });

  it('registers helpers when status equals thisStep', () => {
    render(
      <SafeAreaProvider>
        <OnboardingView
          thisStep={0}
          helpers={{ back: mockBack, next: mockNext, skip: mockSkip }}
        />
      </SafeAreaProvider>
    );
    expect(mockRegisterHelpers).toHaveBeenCalledWith({
      back: mockBack,
      next: mockNext,
      skip: mockSkip
    });
  });
});
