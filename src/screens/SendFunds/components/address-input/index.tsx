import React, { useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { Input, InputRef, Text } from '@components/base';
import { DEVICE_WIDTH } from '@constants/variables';
import { COLORS } from '@constants/colors';
import { StringUtils } from '@utils/string';

interface AddressInputProps {
  address: string;
  onAddressChange: (newAddress: string) => unknown;
}
export const AddressInput = ({
  address,
  onAddressChange
}: AddressInputProps) => {
  const { t } = useTranslation();

  const inputRef = useRef<InputRef>(null);

  const [isInputFocused, setIsInputFocused] = useState(false);

  const toggleFocused = () => setIsInputFocused((prevState) => !prevState);

  const getSliceNumbers = (width: number, fontSize: number) => {
    const totalCharacters = Math.floor(width / fontSize);
    const halfCharacters = Math.floor(totalCharacters / 2);
    const leftSlice = halfCharacters + 9;
    const rightSlice = totalCharacters - leftSlice + 9;
    return { leftSlice, rightSlice };
  };

  const maskedValue = useMemo(() => {
    const { leftSlice, rightSlice } = getSliceNumbers(DEVICE_WIDTH, 16);
    if (isInputFocused) return address;
    return StringUtils.formatAddress(address, leftSlice, rightSlice);
  }, [address, isInputFocused]);

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
        style={{ fontSize: 16, letterSpacing: -0.16 }}
        onChangeValue={onAddressChange}
        placeholder="0x..."
      />
    </View>
  );
};
