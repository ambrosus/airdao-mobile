import { act, fireEvent, render } from '@testing-library/react-native';
import { SettingsBlock } from '@screens/Settings/components/SettingsBlock';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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

  it.skip('should have only one radiobutton active on select base currency', () => {
    const { getByText, getByTestId, getAllByTestId } = render(<Component />);
    fireEvent.press(getByText('Base currency'));
    const baseCurrencyModal = getByTestId('bottom-sheet-select-base-currency');
    expect(baseCurrencyModal).not.toBeNull();
    const radioButtons = getAllByTestId('radio-button');
    act(() => {
      fireEvent.press(radioButtons[0]);
    });

    const otherButtons = radioButtons.filter(
      (item) =>
        item.props.children[0].props.children.props.style[0].borderColor ===
        '#FFFFFF'
    );
    expect(otherButtons.length).toBe(1);

    act(() => {
      fireEvent.press(radioButtons[1]);
    });

    const otherButtons2 = radioButtons.filter(
      (item) =>
        item.props.children[0].props.children.props.style[0].borderColor ===
        '#FFFFFF'
    );

    expect(otherButtons2.length).toBe(1);
  }); // TODO for now we have only one option
});
