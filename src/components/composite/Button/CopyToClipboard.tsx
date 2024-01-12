import React, { useEffect, useRef, useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import { useTranslation } from 'react-i18next';
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
  pressableText?: boolean;
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
    pressableText = false,
    ...buttonProps
  } = props;
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const timeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  const onPress = async () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    setCopied(true);
    if (showToast) {
      Toast.show({
        text: t('common.copied'),
        position: ToastPosition.Top,
        type: ToastType.Success,
        ...toastProps
      });
    }
    await Clipboard.setStringAsync(textToCopy || textToDisplay);
    timeout.current = setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  if (pressableText) {
    return (
      <Button
        {...buttonProps}
        // @ts-ignore
        style={{ ...buttonProps.style, padding: 4 }}
        onPress={onPress}
      >
        <Row alignItems="center" style={{ minHeight: 20 }}>
          {copied ? (
            <Text {...successTextProps}>
              {t(successText || t('common.copied'))}
            </Text>
          ) : (
            <Text {...textProps}>{textToDisplay}</Text>
          )}
          {/* <Spacer horizontal value={scale(16)} /> */}
          {/* {showToast || !copied ? (
            <ClipboardFilledIcon {...iconProps} />
          ) : (
            <Text {...successTextProps}>
              {t(successText || t('common.copied'))}
            </Text>
          )} */}
        </Row>
      </Button>
    );
  }

  return (
    <Row alignItems="center" style={{ minHeight: 20 }}>
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
