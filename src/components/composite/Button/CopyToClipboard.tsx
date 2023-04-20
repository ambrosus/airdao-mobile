import React from 'react';
import * as Clipboard from 'expo-clipboard';
import { TextProps } from '@components/base/Text/Text.types';
import { BaseButtonProps, Button, Row, Spacer, Text } from '@components/base';
import { ClipboardFilledIcon } from '@components/svg/icons';
import { scale } from '@utils/scaling';
import { Toast, ToastType } from '@components/modular';

export interface CopyToClipboardButtonProps
  extends Omit<BaseButtonProps, 'onPress'> {
  textToDisplay: string;
  textToCopy?: string;
  textProps?: TextProps;
}

export const CopyToClipboardButton = (
  props: CopyToClipboardButtonProps
): JSX.Element => {
  const { textToDisplay, textToCopy, textProps, ...buttonProps } = props;

  const onPress = async () => {
    await Clipboard.setStringAsync(textToCopy || textToDisplay);
    Toast.show({ message: 'Copied to Clipboard', type: ToastType.Bottom });
  };

  return (
    <Row alignItems="center">
      <Text {...textProps}>{textToDisplay}</Text>
      <Spacer horizontal value={scale(16)} />
      <Button {...buttonProps} onPress={onPress}>
        <ClipboardFilledIcon />
      </Button>
    </Row>
  );
};
