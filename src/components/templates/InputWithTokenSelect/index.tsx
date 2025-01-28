import {
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
  Platform,
  Pressable,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { InputRef, Text, TextInput } from '@components/base';
import { BottomSheetRef } from '@components/composite';
import { BalanceRow, TokenSelector } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useForwardedRef } from '@hooks';
import { Token } from '@models';
import { isAndroid, StringUtils, NumberUtils } from '@utils';
import { BottomSheetTokensList } from './components';
import { styles } from './styles';

interface InputWithTokenSelectProps {
  readonly title?: string;
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
  resetKeyboardState?: boolean;
  selectable?: boolean;
  isRequiredRefetchBalance?: boolean;
  error?: string;
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
      onBlur,
      resetKeyboardState = false,
      selectable = true,
      isRequiredRefetchBalance = false,
      error = undefined
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

    const onInputPress = useCallback(() => {
      Keyboard.dismiss();

      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => textInputRef.current?.focus(), 200);
      });
    }, []);

    const invisibleTouchableHandlerStyles: StyleProp<ViewStyle> =
      useMemo(() => {
        return {
          width: '100%',
          height: 60,
          position: 'absolute',
          top: 15,
          zIndex: 100
        };
      }, []);

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
            selectable={selectable}
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
        {error !== '' && (
          <Text
            fontSize={12}
            fontFamily="Inter_500Medium"
            fontWeight="500"
            color={COLORS.error400}
            style={styles.error}
          >
            {error}
          </Text>
        )}

        <BalanceRow
          token={token}
          value={value}
          dispatch={dispatch}
          onPressMaxAmount={onPressMaxAmount}
          onChangeText={onChangeText}
          isRequiredRefetchBalance={isRequiredRefetchBalance}
        />

        <BottomSheetTokensList
          title={title ?? ''}
          ref={bottomSheetTokensListRef}
          containerStyle={bottomSheetContainerStyle}
        >
          {bottomSheetNode}
        </BottomSheetTokensList>

        {resetKeyboardState && !isInputFocused && isAndroid && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={onInputPress}
            style={invisibleTouchableHandlerStyles}
          />
        )}
      </>
    );
  }
);
