import React, {
  ReactNode,
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleProp,
  View,
  ViewStyle
} from 'react-native';
import { styles } from './styles';
import { BottomSheetTokensList } from './components';
import { InputRef, Text, TextInput } from '@components/base';
import { BottomSheetRef } from '@components/composite';
import { BalanceRow, TokenSelector } from '@components/modular';
import { Token } from '@models';
import { COLORS } from '@constants/colors';
import { StringUtils } from '@utils/string';
import { NumberUtils } from '@utils/number';
import { useForwardedRef } from '@hooks';

interface InputWithTokenSelectProps {
  readonly title: string;
  readonly value: string;
  readonly label: string;
  readonly token: Token;
  readonly onChangeText: (text: string) => void;
  readonly onPressMaxAmount: (amount?: string) => void;
  readonly dispatch?: boolean;
  bottomSheetNode?: ReactNode;
  bottomSheetContainerStyle?: StyleProp<ViewStyle>;
  onPreviewBottomSheet?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const InputWithTokenSelect = forwardRef<
  BottomSheetRef,
  InputWithTokenSelectProps
>(
  (
    {
      title,
      value,
      label,
      token,
      onChangeText,
      onPressMaxAmount,
      dispatch = true,
      bottomSheetNode,
      bottomSheetContainerStyle,
      onFocus,
      onBlur
    },
    ref
  ) => {
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
      onFocus && onFocus();
      setIsInputFocused((prevState) => !prevState);
    }, [onFocus]);

    const _onBlurInputHandle = useCallback(() => {
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

    return (
      <>
        <Text
          fontSize={14}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral800}
        >
          {label}
        </Text>
        <View style={styles.upperRow}>
          <TokenSelector
            token={token}
            onShowBottomSheetTokensListHandle={
              onShowBottomSheetTokensListHandle
            }
          />
          <Pressable
            onLayout={onLayoutEventHandle}
            onPress={onInputContainerPress}
            style={styles.inputContainer}
          >
            <TextInput
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

        <BalanceRow
          token={token}
          value={value}
          dispatch={dispatch}
          onPressMaxAmount={onPressMaxAmount}
          onChangeText={onChangeText}
        />

        <BottomSheetTokensList
          title={title}
          ref={bottomSheetTokensListRef}
          containerStyle={bottomSheetContainerStyle}
        >
          {bottomSheetNode}
        </BottomSheetTokensList>
      </>
    );
  }
);