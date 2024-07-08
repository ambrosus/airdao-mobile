import React, {
  Dispatch,
  SetStateAction,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  NativeSyntheticEvent,
  StyleProp,
  TextInputKeyPressEventData,
  TextInputSelectionChangeEventData,
  TextStyle
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Clipboard } from '@utils/clipboard';
import { TextInput } from '@components/base/Input/Input.text';
import { InputRef, TextInputProps } from '@components/base';
import { COLORS } from '@constants/colors';
import { moderateScale, scale, verticalScale } from '@utils/scaling';

type SelectionKeys = 'start' | 'end';
type SelectionObject = Record<SelectionKeys, null | number>;

type PrivateKeyMaskedInputProps = TextInputProps & {
  value: string;
  secureTextEntry: boolean;
  setPrivateKey: Dispatch<SetStateAction<string>>;
};

const _isAlphanumeric = (char: string): boolean => {
  return /^[a-zA-Z0-9$]+$/.test(char);
};

const SELECTION_INITIAL_STATE = {
  start: null,
  end: null
};

const PRIVATE_KEY_MAX_LENGTH = 64;

export const PrivateKeyMaskedInput = forwardRef<
  InputRef,
  PrivateKeyMaskedInputProps
>(({ value, setPrivateKey, secureTextEntry }, maskedInputRef) => {
  const { t } = useTranslation();
  const inputStyle: StyleProp<TextStyle> = useMemo(() => {
    return {
      width: '100%',
      height: 90,
      borderRadius: moderateScale(12),
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(12),
      paddingBottom: verticalScale(12),
      fontSize: 16,
      fontFamily: 'Inter_400Regular',
      textAlign: 'left',
      verticalAlign: 'top'
    };
  }, []);

  const [clipboard, setClipboard] = useState('');

  useEffect(() => {
    const fetchClipboard = async () => {
      const clipboardContent = await Clipboard.getClipboardString();
      setClipboard(clipboardContent);
    };

    fetchClipboard();

    const intervalId = setInterval(fetchClipboard, 500);
    return () => clearInterval(intervalId);
  }, []);

  const [currentCaretPosition, setCurrentCaretPosition] = useState<
    number | null
  >(null);

  const [selection, setSelection] = useState<SelectionObject>(
    SELECTION_INITIAL_STATE
  );

  const onChangePrivateKey = useCallback(
    (text: string) => {
      if (!secureTextEntry) {
        const removedExtraSymbols = text.replace(/[^\w$]/g, '');
        setPrivateKey(removedExtraSymbols);
      } else if (secureTextEntry && clipboard.includes(text)) {
        setPrivateKey(text);
        setCurrentCaretPosition(text.length);
      }
    },
    [clipboard, secureTextEntry, setPrivateKey]
  );

  const _isSelectionEmpty = useMemo(() => {
    return selection.start === null || selection.end === null;
  }, [selection]);

  const maskedValue = useMemo(() => {
    return secureTextEntry
      ? Array.from({ length: value.length }).fill('*').join('')
      : value;
  }, [secureTextEntry, value]);

  const onKeyPress = useCallback(
    (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      if (secureTextEntry) {
        const key = event.nativeEvent.key;
        const caretPosition =
          currentCaretPosition !== null ? currentCaretPosition : value.length;

        if (key.toLowerCase() === 'backspace') {
          if (!_isSelectionEmpty) {
            // Delete selected text
            const selectionStart = selection.start || 0;
            const selectionEnd = selection.end || 0;
            const newPrivateKey =
              value.slice(0, selectionStart) + value.slice(selectionEnd);
            setPrivateKey(newPrivateKey);
            setSelection({ start: null, end: null });
          } else if (value.length > 0 && caretPosition > 0) {
            // Delete single character before caret position
            const newPrivateKey =
              value.slice(0, caretPosition - 1) + value.slice(caretPosition);
            setPrivateKey(newPrivateKey);
            setCurrentCaretPosition(caretPosition - 1);
          }
        } else if (
          key === ' ' &&
          maskedValue.length !== PRIVATE_KEY_MAX_LENGTH
        ) {
          setPrivateKey((prevValue) => prevValue + ' ');
          setCurrentCaretPosition(caretPosition + 1);
        } else if (
          _isAlphanumeric(key) &&
          maskedValue.length < PRIVATE_KEY_MAX_LENGTH
        ) {
          // Insert alphanumeric key at caret position
          const newPrivateKey =
            value.slice(0, caretPosition) + key + value.slice(caretPosition);
          setPrivateKey(newPrivateKey);
          setCurrentCaretPosition(caretPosition + 1);
        }
      }
    },
    [
      secureTextEntry,
      maskedValue,
      _isSelectionEmpty,
      selection.start,
      selection.end,
      value,
      setPrivateKey,
      currentCaretPosition,
      setCurrentCaretPosition
    ]
  );

  const placeholder = useMemo(() => {
    return secureTextEntry
      ? '******************************'
      : t('import.wallet.key');
  }, [secureTextEntry, t]);

  const onSelectionChange = useCallback(
    (event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
      if (secureTextEntry) {
        const { start, end } = event.nativeEvent.selection;

        if (start === end) {
          setSelection(SELECTION_INITIAL_STATE);
          setCurrentCaretPosition(start);
        } else {
          setSelection({
            ...selection,
            start,
            end
          });
        }
      }
    },
    [secureTextEntry, selection]
  );

  return (
    <TextInput
      ref={maskedInputRef}
      scrollEnabled={false}
      multiline
      value={maskedValue}
      maxLength={64}
      blurOnSubmit
      autoCapitalize="none"
      autoCorrect={false}
      onChangeText={onChangePrivateKey}
      onSelectionChange={onSelectionChange}
      onKeyPress={onKeyPress}
      placeholderTextColor={COLORS.alphaBlack60}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      style={inputStyle}
    />
  );
});
