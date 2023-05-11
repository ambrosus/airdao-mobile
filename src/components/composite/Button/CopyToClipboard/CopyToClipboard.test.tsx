import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import * as Clipboard from 'expo-clipboard';
import { CopyToClipboardButton } from '.';

describe('CopyToClipboardButton Component', () => {
  it('copies text to clipboard when button is pressed', async () => {
    const textToCopy = 'test text';
    const { getByTestId } = render(
      <CopyToClipboardButton
        textToDisplay="Copy to Clipboard"
        textToCopy={textToCopy}
        testID="copy-button"
      />
    );
    // TODO fix this test
    // const button = getByTestId('copy-button-button');
    // await button.props.onClick();
    // // fireEvent.press(button);
    // const textAtClipboard = await Clipboard.getStringAsync();
    // expect(textAtClipboard).toEqual(textToCopy);
  });
  it('displays correct text to screen', async () => {
    const textToCopy = 'test text';
    const { getByText } = render(
      <CopyToClipboardButton
        textToDisplay="Copy to Clipboard"
        textToCopy={textToCopy}
        testID="copy-button"
      />
    );
    const clipboardText = getByText('Copy to Clipboard');
    expect(clipboardText).toBeDefined();
  });
});
