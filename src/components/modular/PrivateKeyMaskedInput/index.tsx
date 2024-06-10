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

const _isAlphanumeric = (char: string) => {
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

  const [currentCarretPosition, setCurrentCarretPosition] = useState<
    number | null
  >(null);

  const [selection, setSelection] = useState<SelectionObject>(
    SELECTION_INITIAL_STATE
  );

  const onChangePrivateKey = useCallback(
    (text: string) => {
      if (!secureTextEntry) {
        setPrivateKey(text);
      } else if (secureTextEntry && clipboard.includes(text)) {
        setCurrentCarretPosition(text.length);
        setPrivateKey(text);
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

        if (key.toLowerCase() === 'backspace') {
          if (!_isSelectionEmpty) {
            // Check if selection is not empty
            const selectionStart = selection.start || 0;
            const selectionEnd = selection.end || 0;
            const newPrivateKey =
              value.slice(0, selectionStart) + value.slice(selectionEnd);
            setPrivateKey(newPrivateKey);
            setSelection({ start: null, end: null });
          } else {
            setPrivateKey(value.slice(0, -1));
          }
        } else if (key === ' ') {
          setPrivateKey(value + ' ');
        } else if (
          secureTextEntry &&
          _isAlphanumeric(key) &&
          maskedValue.length !== PRIVATE_KEY_MAX_LENGTH
        ) {
          // Insert the key at the current caret position
          const currentPos =
            currentCarretPosition !== null
              ? currentCarretPosition
              : value.length;
          const newPrivateKey =
            value.substring(0, currentPos) + key + value.substring(currentPos);
          setPrivateKey(newPrivateKey);
          // Incrementing caret position
          setCurrentCarretPosition(currentPos + 1);
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
      currentCarretPosition
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
          setCurrentCarretPosition(start);
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
