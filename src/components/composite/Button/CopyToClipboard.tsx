import React from 'react';
import * as Clipboard from 'expo-clipboard';
import { TextProps } from '@components/base/Text/Text.types';
import { Button, Row, Spacer, Text } from '@components/base';
import { ClipboardFilledIcon, IconProps } from '@components/svg/icons';
import { scale } from '@utils/scaling';
import {
  Toast,
  ToastOptions,
  ToastPosition,
  ToastType
} from '@components/modular/Toast';
import { BaseButtonProps } from '@components/base/Button';
import { useTranslation } from 'react-i18next';

export interface CopyToClipboardButtonProps
  extends Omit<BaseButtonProps, 'onPress'> {
  textToDisplay: string;
  textToCopy?: string;
  textProps?: TextProps;
  iconProps?: IconProps;
  toastProps?: Pick<ToastOptions, 'position'>;
}

export const CopyToClipboardButton = (
  props: CopyToClipboardButtonProps
): JSX.Element => {
  const {
    textToDisplay,
    textToCopy,
    textProps,
    iconProps,
    toastProps,
    ...buttonProps
  } = props;
  const { t } = useTranslation();

  const onPress = async () => {
    Toast.show({
      text: t('common.copied'),
      position: ToastPosition.Top,
      type: ToastType.Success,
      ...toastProps
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
