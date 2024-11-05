import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  InteractionManager,
  Keyboard,
  TouchableOpacity,
  View
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { Input, InputRef, Text } from '@components/base';
import { isAndroid, isIos } from '@utils/isPlatform';
import { DEVICE_WIDTH } from '@constants/variables';
import { COLORS } from '@constants/colors';

interface AddressInputProps {
  address: string;
  onAddressChange: (newAddress: string) => unknown;
  resetKeyboardState?: boolean;
}
export const AddressInput = ({
  address,
  onAddressChange,
  resetKeyboardState
}: AddressInputProps) => {
  const { t } = useTranslation();

  const inputRef = useRef<InputRef>(null);

  const [isInputFocused, setIsInputFocused] = useState(false);

  const toggleFocused = () => setIsInputFocused((prevState) => !prevState);

  const maskedValue = useMemo(() => {
    const lettersToSlice = Math.floor(DEVICE_WIDTH / 12);
    if (isAndroid && (address === '' || address.length < 32)) return address;

    return isIos || isInputFocused
      ? address
      : `${address.slice(0, lettersToSlice)}...`;
  }, [address, isInputFocused]);

  const onInputPress = useCallback(() => {
    Keyboard.dismiss();

    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => inputRef.current?.focus(), 200);
    });
  }, []);

  const resetContainerActive = useMemo(
    () => resetKeyboardState && !isInputFocused && isAndroid,
    [isInputFocused, resetKeyboardState]
  );

  return (
    <View style={styles.container}>
      <Text
        fontSize={14}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral800}
      >
        {t('send.funds.recipient')}
      </Text>
      <Input
        ref={inputRef}
        numberOfLines={1}
        onFocus={toggleFocused}
        onBlur={toggleFocused}
        value={maskedValue}
        onChangeValue={onAddressChange}
        placeholder="0x..."
      />
      {resetContainerActive && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={onInputPress}
          style={styles.touchableHandlerArea}
        />
      )}
    </View>
  );
};
