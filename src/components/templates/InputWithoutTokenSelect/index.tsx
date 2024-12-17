import React, {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  InteractionManager,
  Keyboard,
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import {
  Button,
  InputRef,
  Row,
  Spacer,
  Text,
  TextInput
} from '@components/base';
import { BottomSheetRef } from '@components/composite';
import { TokenLogo, TokenSelector } from '@components/modular';
import { Token } from '@models';
import { COLORS } from '@constants/colors';
import { StringUtils } from '@utils/string';
import { NumberUtils } from '@utils/number';
import { useForwardedRef } from '@hooks';
import { isAndroid } from '@utils/isPlatform';
import { scale } from '@utils/scaling';
import { DownArrowIcon } from '@components/svg/icons';

interface InputWithoutTokenSelectProps {
  readonly title?: string;
  readonly value: string;
  readonly label?: string;
  readonly token: Token;
  readonly onChangeText: (text: string) => void;
  readonly onPressMaxAmount: (amount?: string) => void;
  exchange?: {
    token: string;
    value: string;
  };

  onFocus?: () => void;
  onBlur?: () => void;
  resetKeyboardState?: boolean;
  isRequiredRefetchBalance?: boolean;
  inputError?: string;
}

export const InputWithoutTokenSelect = forwardRef<
  BottomSheetRef,
  InputWithoutTokenSelectProps
>(
  (
    {
      value,
      label,
      token,
      onChangeText,
      onPressMaxAmount,
      onFocus,
      onBlur,
      resetKeyboardState = false,
      exchange,
      inputError
    },
    ref
  ) => {
    const { t } = useTranslation();
    const textInputRef = useRef<InputRef>(null);
    const bottomSheetTokensListRef = useForwardedRef<BottomSheetRef>(ref);

    const [isInputFocused, setIsInputFocused] = useState(false);
    const [inputContainerWidth, setInputContainerWidth] = useState(0);

    const onChangeTokenAmount = (value: string) => {
      let finalValue = StringUtils.formatNumberInput(value);
      finalValue = NumberUtils.limitDecimalCount(finalValue, 18);
      onChangeText(finalValue);
    };

    const _onFocusInputHandle = useCallback(() => {
      // tslint:disable-next-line:no-unused-expression
      onFocus && onFocus();
      setIsInputFocused((prevState) => !prevState);
    }, [onFocus]);

    const _onBlurInputHandle = useCallback(() => {
      // tslint:disable-next-line:no-unused-expression
      onBlur && onBlur();
      setIsInputFocused((prevState) => !prevState);
    }, [onBlur]);

    const selection = useMemo(() => {
      if (!isInputFocused && value.length > 0) {
        return { start: 0, end: 0 };
      }
    }, [isInputFocused, value.length]);

    const _value = useMemo(() => {
      const maxCharacterLimit = Math.floor(inputContainerWidth / 16);

      return StringUtils.wrapAndroidString(
        value,
        isInputFocused,
        maxCharacterLimit,
        true
      );
    }, [inputContainerWidth, isInputFocused, value]);

    const inputStyle = useMemo(() => {
      return Platform.select({
        android: { ...styles.input, ...styles.inputAndroidSpecified },
        ios: styles.input,
        default: styles.input
      });
    }, []);

    const onInputContainerPress = useCallback(
      () => textInputRef.current?.focus(),
      []
    );

    const onLayoutEventHandle = useCallback(
      (event: LayoutChangeEvent) =>
        setInputContainerWidth(event.nativeEvent.layout.width),
      []
    );

    const onShowBottomSheetTokensListHandle = useCallback(
      () => bottomSheetTokensListRef.current?.show(),
      [bottomSheetTokensListRef]
    );

    const onInputPress = useCallback(() => {
      Keyboard.dismiss();

      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => textInputRef.current?.focus(), 200);
      });
    }, []);

    const invisibleTouchableHandlerStyles: StyleProp<ViewStyle> =
      useMemo(() => {
        return styles.touchableHandler;
      }, []);

    return (
      <>
        <View style={[styles.wrapper, inputError ? styles.errorWrap : {}]}>
          {label && (
            <Text
              fontSize={scale(14)}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral800}
            >
              {label}
            </Text>
          )}
          <View style={styles.upperRow}>
            <View style={styles.selectorWrapper}>
              <TokenSelector
                customTokenStyle={{ fontFamily: 'Inter_500Medium' }}
                selectable={false}
                token={token}
                onShowBottomSheetTokensListHandle={
                  onShowBottomSheetTokensListHandle
                }
              />
            </View>
            <Pressable
              onLayout={onLayoutEventHandle}
              onPress={onInputContainerPress}
              style={styles.inputContainer}
            >
              <TextInput
                ref={textInputRef}
                value={_value}
                placeholder="0"
                type="number"
                numberOfLines={1}
                keyboardType="decimal-pad"
                onFocus={_onFocusInputHandle}
                onBlur={_onBlurInputHandle}
                selection={selection}
                onChangeText={onChangeTokenAmount}
                style={inputStyle}
                textAlign="right"
              />
            </Pressable>
          </View>
          <Row justifyContent="space-between" alignItems="center">
            <Text fontSize={scale(12)}>
              {t('common.balance')}:{' '}
              <Text fontSize={scale(12)} color={COLORS.neutral900}>
                {NumberUtils.formatNumber(
                  +NumberUtils.limitDecimalCount(
                    token.balance.formattedBalance,
                    2
                  )
                )}{' '}
                {token.symbol}
              </Text>
            </Text>
            {!inputError ? (
              <Button style={styles.button} onPress={onPressMaxAmount}>
                <Text
                  fontFamily="Inter_600SemiBold"
                  fontSize={scale(12)}
                  color={COLORS.brand600}
                >
                  {t('bridge.preview.button.max')}
                </Text>
              </Button>
            ) : (
              <View>
                <Text fontSize={scale(12)} color={COLORS.error500}>
                  {inputError}
                </Text>
              </View>
            )}
          </Row>
          {resetKeyboardState && !isInputFocused && isAndroid && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={onInputPress}
              style={invisibleTouchableHandlerStyles}
            />
          )}
        </View>
        {!!exchange && (
          <>
            <View style={styles.exchangeMain}>
              <View style={styles.exchangeContainerIcon}>
                <DownArrowIcon scale={1.2} />
              </View>
            </View>
            <Row
              style={styles.exchangeRate}
              alignItems="center"
              justifyContent="space-between"
            >
              <Row alignItems="center">
                <TokenLogo token={exchange.token} />
                <Spacer horizontal value={scale(8)} />
                <Text fontSize={scale(14)} color={COLORS.neutral900}>
                  {exchange.token}
                </Text>
              </Row>
              <Text
                color={exchange.value ? COLORS.neutral900 : COLORS.neutral400}
                fontSize={scale(14)}
              >
                {+exchange?.value > 0 ? exchange.value : 0}
              </Text>
            </Row>
          </>
        )}
      </>
    );
  }
);
