import React, {
  ReactNode,
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
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleProp,
  TextInputContentSizeChangeEventData,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { useTranslation } from 'react-i18next';
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
import { DownArrowIcon } from '@components/svg/icons';
import { WalletStakeIcon } from '@components/svg/icons/v2/harbor';
import { COLORS } from '@constants/colors';
import { useForwardedRef } from '@hooks';
import { Token } from '@models';
import { scale, StringUtils, NumberUtils, isAndroid } from '@utils';
import { styles } from './styles';

interface InputWithoutTokenSelectProps {
  readonly title?: string;
  readonly value: string;
  readonly defaultValue?: string;
  readonly label?: string;
  readonly token: Token;
  readonly onChangeText: (text: string) => void;
  readonly onPressMaxAmount: (amount?: string) => void;
  exchange?: {
    token: string;
    value: string;
    availableToStake?: boolean;
  };
  onFocus?: () => void;
  onBlur?: () => void;
  resetKeyboardState?: boolean;
  isRequiredRefetchBalance?: boolean;
  inputError?: string;
  arrow?: boolean;
  readonly balance?: string;
  editable?: boolean;
  onContentSizeChange?: (
    event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
  ) => void;
  valueColor?: string;
  renderInputLockNode?: ReactNode;
  maxButtonLocked?: boolean;
}

export const InputWithoutTokenSelect = forwardRef<
  BottomSheetRef,
  InputWithoutTokenSelectProps
>(
  (
    {
      value,
      defaultValue,
      label,
      token,
      onChangeText,
      onPressMaxAmount,
      onFocus,
      onBlur,
      resetKeyboardState = false,
      exchange,
      inputError,
      arrow = true,
      balance,
      editable = true,
      onContentSizeChange,
      renderInputLockNode,
      valueColor = COLORS.neutral900,
      maxButtonLocked = false
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
      return {
        ...Platform.select({
          android: { ...styles.input, ...styles.inputAndroidSpecified },
          ios: styles.input,
          default: styles.input
        }),
        color: valueColor
      };
    }, [valueColor]);

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
                editable={editable}
                ref={textInputRef}
                value={_value}
                defaultValue={defaultValue}
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
                onContentSizeChange={onContentSizeChange}
              />
              {renderInputLockNode}
            </Pressable>
          </View>
          <Row justifyContent="space-between" alignItems="center">
            <Text fontSize={scale(12)}>
              {t('common.balance')}:{' '}
              <Text fontSize={scale(12)} color={COLORS.neutral900}>
                {NumberUtils.formatNumber(
                  +NumberUtils.limitDecimalCount(
                    balance ? balance : token.balance.formattedBalance,
                    2
                  )
                )}{' '}
                {token.symbol}
              </Text>
            </Text>
            {!inputError ? (
              <Button
                style={styles.button}
                disabled={maxButtonLocked}
                onPress={onPressMaxAmount}
              >
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
                <Text
                  fontSize={scale(12)}
                  fontFamily="Inter_600SemiBold"
                  color={COLORS.error500}
                  style={styles.button}
                >
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
        {!!exchange &&
          (exchange.availableToStake ? (
            <>
              {arrow ? (
                <View style={styles.exchangeMain}>
                  <View style={styles.exchangeContainerIcon}>
                    <DownArrowIcon color="#585E77" scale={1.2} />
                  </View>
                </View>
              ) : (
                <Spacer value={8} />
              )}
              <Row
                style={styles.exchangeRate}
                alignItems="center"
                justifyContent="space-between"
              >
                <Row alignItems="center">
                  <WalletStakeIcon />
                  <Spacer horizontal value={4} />
                  <Text
                    fontSize={14}
                    fontFamily="Inter_500Medium"
                    color={COLORS.neutral900}
                  >
                    Available to Stake
                  </Text>
                </Row>
                <Row alignItems="center">
                  <TokenLogo scale={0.75} token={exchange.token} />
                  <Spacer horizontal value={scale(4)} />
                  <Text
                    fontSize={scale(14)}
                    color={
                      exchange.value ? COLORS.neutral900 : COLORS.neutral400
                    }
                  >
                    {exchange.value}
                  </Text>
                  <Spacer horizontal value={scale(2)} />
                  <Text fontSize={scale(14)} color={COLORS.neutral900}>
                    {exchange.token}
                  </Text>
                </Row>
              </Row>
            </>
          ) : (
            <>
              <View style={styles.exchangeMain}>
                <View style={styles.exchangeContainerIcon}>
                  <DownArrowIcon color="#585E77" scale={1.2} />
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
          ))}
      </>
    );
  }
);
