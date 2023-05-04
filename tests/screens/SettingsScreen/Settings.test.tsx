import React from 'react';
import { render } from '@testing-library/react-native';
import { SettingsScreen } from '@screens/Settings';

jest.mock('@helpers/createContextSelector', () => ({
  createContextSelector: () => [{}, jest.fn()]
}));

describe('SettingsScreen', () => {
  it('renders the SettingsBlock and SettingsInfoBlock components', () => {
    const { getByTestId } = render(<SettingsScreen />);
    const settingsBlock = getByTestId('settings-block');
    const settingsInfoBlock = getByTestId('settings-info-block');
    expect(settingsBlock).toBeTruthy();
    expect(settingsInfoBlock).toBeTruthy();
  });
});
