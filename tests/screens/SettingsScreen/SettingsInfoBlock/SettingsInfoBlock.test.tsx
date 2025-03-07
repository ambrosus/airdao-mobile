import { fireEvent, render } from '@testing-library/react-native';
import { SettingsInfoBlock } from '@screens/Settings/components/SettingsInfoBlock';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import clearAllMocks = jest.clearAllMocks;

const Component = () => {
  return (
    <SafeAreaProvider>
      <SettingsInfoBlock />
    </SafeAreaProvider>
  );
};

describe('SettingsInfoBlock', () => {
  afterAll(() => {
    clearAllMocks();
  });

  it('renders the text inside settings-screen_settings-info-block inside the button', () => {
    const { getByText } = render(<Component />);
    expect(getByText('Help center')).not.toBeNull();
    expect(getByText('Rate us on the App Store')).not.toBeNull();
  });
  it('checks if buttons are pressable', () => {
    const { getByText } = render(<Component />);
    const helpButton = getByText('Help center');
    const rateButton = getByText('Rate us on the App Store');
    fireEvent.press(helpButton);
    fireEvent.press(rateButton);
    expect(helpButton).toBeTruthy();
    expect(rateButton).toBeTruthy();
  });
});
