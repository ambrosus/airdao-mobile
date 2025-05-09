import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleProp,
  TextInputKeyPressEventData,
  TextInputSelectionChangeEventData,
  TextStyle
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { InputRef, InputProps } from '@components/base';
// import { InputRef, TextInputProps } from '@components/base';
import { TextInput } from '@components/base/Input/Input.text';
import { COLORS } from '@constants/colors';
import { Clipboard } from '@utils';
import { styles } from './styles';

type SelectionKeys = 'start' | 'end';
type SelectionObject = Record<SelectionKeys, null | number>;

type PrivateKeyMaskedInputProps = InputProps & {
  color?: string;
  value: string;
  secureTextEntry: boolean;
  setPrivateKey: (value: string) => void;
};

const _isAlphanumeric = (char: string): boolean => {
  return /^[a-zA-Z0-9$]+$/.test(char);
};

const SELECTION_INITIAL_STATE = {
  start: null,
  end: null
};

export const PrivateKeyMaskedInput = forwardRef<
  InputRef,
  PrivateKeyMaskedInputProps
>(({ color, value, setPrivateKey, secureTextEntry }, maskedInputRef) => {
  const { t } = useTranslation();
  const inputStyle: StyleProp<TextStyle> = useMemo(() => {
    return {
      ...styles.inputStyle,
      color: color || COLORS.neutral900
    };
  }, [color]);

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
        } else if (_isAlphanumeric(key)) {
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
      currentCaretPosition,
      value,
      _isSelectionEmpty,
      selection.start,
      selection.end,
      setPrivateKey
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
      blurOnSubmit
      maxLength={120}
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
