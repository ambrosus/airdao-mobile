import { fireEvent, render } from '@testing-library/react-native';
import { SettingsBlock } from '@screens/Settings/components/SettingsBlock';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('victory-native', () => ({}));
const queryClient = new QueryClient();
const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <SettingsBlock />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};
describe('SettingsBlock component', () => {
  it('should render correctly on ios', () => {
    jest.mock('react-native/Libraries/Utilities/Platform', () => ({
      OS: 'ios'
    }));
    const { getByTestId } = render(<Component />);
    const settingsBlock = getByTestId('settings-screen_settings-block');
    expect(settingsBlock).toBeDefined();
  });
  it('should render correctly on android', () => {
    jest.mock('react-native/Libraries/Utilities/Platform', () => ({
      OS: 'android'
    }));
    const { getByTestId } = render(<Component />);
    const settingsBlock = getByTestId('settings-screen_settings-block');
    expect(settingsBlock).toBeDefined();
  });
  it('should render the base currency option', () => {
    const { getByText } = render(<Component />);
    expect(getByText('Base currency')).not.toBeNull();
  });

  it('should open the base currency modal on press', () => {
    const { getByText, getByTestId } = render(<Component />);
    fireEvent.press(getByText('Base currency'));
    expect(getByTestId('bottom-sheet-select-base-currency')).not.toBeNull();
  });

  it('should render the language option', () => {
    const { getByText } = render(<Component />);
    expect(getByText('Language')).not.toBeNull();
  });

  it('should open the language modal on press', () => {
    const { getByText, getByTestId } = render(<Component />);
    fireEvent.press(getByText('Language'));
    expect(getByTestId('bottom-sheet-select-language')).not.toBeNull();
  });

  it('should render the notification settings option', () => {
    const { getByText } = render(<Component />);
    expect(getByText('Notification settings')).not.toBeNull();
  });

  it('should open the notification settings modal on press', () => {
    const { getByText, getByTestId } = render(<Component />);
    fireEvent.press(getByText('Notification settings'));
    expect(getByTestId('bottom-sheet-notification-settings')).not.toBeNull();
  });
});
