import { fireEvent, render } from '@testing-library/react-native';
import { SettingsInfoBlock } from '@screens/Settings/components/SettingsInfoBlock';
import React from 'react';

describe('SettingsInfoBlock', () => {
  it('renders the text inside settings-screen_settings-info-block inside the button', () => {
    const { getByText } = render(<SettingsInfoBlock />);
    expect(getByText('Help center')).not.toBeNull();
    expect(getByText('Rate us on the App Store')).not.toBeNull();
  });
  it('checks if buttons are pressable', () => {
    const { getByText } = render(<SettingsInfoBlock />);
    const helpButton = getByText('Help center');
    const rateButton = getByText('Rate us on the App Store');
    fireEvent.press(helpButton);
    fireEvent.press(rateButton);
    expect(helpButton).toBeTruthy();
    expect(rateButton).toBeTruthy();
  });
});
