import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { WelcomeScreen } from '@screens/Welcome';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient();

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <WelcomeScreen />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('WelcomeScreen', () => {
  it('renders correctly', () => {
    const { getByTestId, getByText } = render(<Component />);
    const optionsList = getByTestId('Options_List');
    const firstOption = getByTestId('First_Option');
    const secondOption = getByTestId('Second_Option');
    const thirdOption = getByTestId('Third_Option');
    const getStartedButton = getByTestId('Get_Started_Button');
    expect(optionsList).toBeDefined();
    expect(firstOption).toBeDefined();
    expect(secondOption).toBeDefined();
    expect(thirdOption).toBeDefined();
    expect(getStartedButton).toBeDefined();
    expect(getByText('AirDAO')).toBeTruthy();
    expect(
      getByText('Experience the ease of tracking addresses on the go!')
    ).toBeTruthy();
    expect(getByText('Get started')).toBeTruthy();
  });
});
