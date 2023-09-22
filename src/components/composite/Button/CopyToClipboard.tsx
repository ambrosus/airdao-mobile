import React from 'react';
import * as Clipboard from 'expo-clipboard';
import { TextProps } from '@components/base/Text/Text.types';
import { Button, Row, Spacer, Text } from '@components/base';
import { ClipboardFilledIcon, IconProps } from '@components/svg/icons';
import { scale } from '@utils/scaling';
import { Toast, ToastPosition, ToastType } from '@components/modular/Toast';
import { BaseButtonProps } from '@components/base/Button';
import { useTranslation } from 'react-i18next';

export interface CopyToClipboardButtonProps
  extends Omit<BaseButtonProps, 'onPress'> {
  textToDisplay: string;
  textToCopy?: string;
  textProps?: TextProps;
  iconProps?: IconProps;
}

export const CopyToClipboardButton = (
  props: CopyToClipboardButtonProps
): JSX.Element => {
  const { textToDisplay, textToCopy, textProps, iconProps, ...buttonProps } =
    props;
  const { t } = useTranslation();

  const onPress = async () => {
    Toast.show({
      text: t('copied.to.clipboard'),
      position: ToastPosition.Bottom,
      type: ToastType.Success
    });
    await Clipboard.setStringAsync(textToCopy || textToDisplay);
  };

  return (
    <Row alignItems="center">
      <Text {...textProps}>{textToDisplay}</Text>
      <Spacer horizontal value={scale(16)} />
      <Button {...buttonProps} onPress={onPress}>
        <ClipboardFilledIcon {...iconProps} />
      </Button>
    </Row>
  );
};
