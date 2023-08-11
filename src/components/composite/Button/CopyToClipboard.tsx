import React from 'react';
import * as Clipboard from 'expo-clipboard';
import { TextProps } from '@components/base/Text/Text.types';
import { Button, Row, Spacer, Text } from '@components/base';
import { ClipboardFilledIcon } from '@components/svg/icons';
import { scale } from '@utils/scaling';
import { Toast, ToastPosition } from '@components/modular/Toast';
import { BaseButtonProps } from '@components/base/Button';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const onPress = async () => {
    Toast.show({
      message: t('copied.to.clipboard'),
      type: ToastPosition.Bottom
    });
    await Clipboard.setStringAsync(textToCopy || textToDisplay);
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
