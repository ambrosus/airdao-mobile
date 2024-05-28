import React, {
  Dispatch,
  SetStateAction,
  useCallback,
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
import { useFocusEffect } from '@react-navigation/native';
import { Clipboard } from '@utils/clipboard';
import { TextInput } from '@components/base/Input/Input.text';
import { TextInputProps } from '@components/base';
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

export const PrivateKeyMaskedInput = ({
  value,
  setPrivateKey,
  secureTextEntry
}: PrivateKeyMaskedInputProps) => {
  const inputStyle: StyleProp<TextStyle> = useMemo(() => {
    return {
      width: '100%',
      height: 90,
      borderRadius: moderateScale(12),
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(12),
      paddingBottom: verticalScale(12),
      fontSize: 16,
      fontFamily: 'Inter_400Regular'
    };
  }, []);

  const [clipboard, setClipboard] = useState('');
  const [currentCarretPosition, setCurrentCarretPosition] = useState<
    number | null
  >(null);

  const [selection, setSelection] = useState<SelectionObject>(
    SELECTION_INITIAL_STATE
  );

  useFocusEffect(
    useCallback(() => {
      Clipboard.getClipboardString().then((r) => {
        setClipboard(r);
      });
    }, [])
  );

  const onChangePrivateKey = async (text: string) => {
    if (!secureTextEntry) {
      setPrivateKey(text);
    } else if (secureTextEntry && text === clipboard) {
      setPrivateKey(text);
    }
  };

  const _isSelectionEmpty = useMemo(() => {
    return selection.start === null || selection.end === null;
  }, [selection]);

  const onKeyPress = useCallback(
    (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      const key = event.nativeEvent.key;

      if (secureTextEntry && key.toLowerCase() === 'backspace') {
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
      } else if (secureTextEntry && _isAlphanumeric(key)) {
        // Insert the key at the current caret position
        const currentPos =
          currentCarretPosition !== null ? currentCarretPosition : value.length;
        const newPrivateKey =
          value.substring(0, currentPos) + key + value.substring(currentPos);
        setPrivateKey(newPrivateKey);
        // Increment the caret position
        setCurrentCarretPosition(currentPos + 1);
      }
    },
    [
      _isSelectionEmpty,
      secureTextEntry,
      currentCarretPosition,
      selection.end,
      selection.start,
      setPrivateKey,
      setSelection,
      value
    ]
  );

  const maskedValue = useMemo(() => {
    return secureTextEntry
      ? Array.from({ length: value.length }).fill('*').join('')
      : value;
  }, [secureTextEntry, value]);

  const placeholder = useMemo(() => {
    return secureTextEntry ? '******************************' : 'Private key';
  }, [secureTextEntry]);

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
      scrollEnabled={false}
      multiline
      value={maskedValue}
      maxLength={66}
      onChangeText={onChangePrivateKey}
      onSelectionChange={onSelectionChange}
      onKeyPress={onKeyPress}
      placeholderTextColor={COLORS.alphaBlack60}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      style={inputStyle}
    />
  );
};
