import React, { useReducer } from 'react';
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
  successText?: string;
  successTextProps?: TextProps;
  iconProps?: IconProps;
  toastProps?: Pick<ToastOptions, 'position'>;
  showToast?: boolean;
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
    showToast = false,
    successText,
    successTextProps,
    ...buttonProps
  } = props;
  const { t } = useTranslation();
  const [copied, toggleCopied] = useReducer((flag) => !flag, false);

  const onPress = async () => {
    toggleCopied();
    if (showToast) {
      Toast.show({
        text: t('copied.to.clipboard'),
        position: ToastPosition.Top,
        type: ToastType.Success,
        ...toastProps
      });
    }
    await Clipboard.setStringAsync(textToCopy || textToDisplay);
    setTimeout(() => {
      toggleCopied();
    }, 500);
  };

  return (
    <Row alignItems="center">
      <Text {...textProps}>{textToDisplay}</Text>
      <Spacer horizontal value={scale(16)} />
      <Button {...buttonProps} onPress={onPress}>
        {showToast || !copied ? (
          <ClipboardFilledIcon {...iconProps} />
        ) : (
          <Text {...successTextProps}>
            {t(successText || t('common.copied'))}
          </Text>
        )}
      </Button>
    </Row>
  );
};
