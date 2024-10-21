import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  InteractionManager,
  Keyboard,
  StyleProp,
  TouchableOpacity,
  ViewStyle,
  useWindowDimensions
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { BarcodeScanner } from '@components/templates';
import {
  BottomSheet,
  BottomSheetRef,
  InputWithIcon
} from '@components/composite';
import { Button, InputRef } from '@components/base';
import { Checkmark, ScannerIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { etherumAddressRegex } from '@constants/regex';
import { moderateScale } from '@utils/scaling';
import { isAndroid, isIos } from '@utils/isPlatform';
import { DEVICE_WIDTH } from '@constants/variables';

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
  const { height: WINDOW_HEIGHT } = useWindowDimensions();
  const scannerModalRef = useRef<BottomSheetRef>(null);
  const scanned = useRef(false);
  const inputRef = useRef<InputRef>(null);
  const isValidEthAddress = address.match(etherumAddressRegex);

  const [isInputFocused, setIsInputFocused] = useState(false);

  const showScanner = () => {
    scannerModalRef.current?.show();
  };
  const hideScanner = () => {
    scannerModalRef.current?.dismiss();
  };

  const onQRCodeScanned = (data: string) => {
    const res = data.match(etherumAddressRegex);
    if (res && res?.length > 0) {
      hideScanner();
      inputRef.current?.setText(res[0]);
      setTimeout(() => {
        onAddressChange(res[0]);
      }, 500);
    } else if (!scanned.current) {
      scanned.current = true;
      Alert.alert(t('alert.invalid.qr.code.msg'), '', [
        {
          text: t('alert.scan.again.msg'),
          onPress: () => {
            scanned.current = false;
          }
        }
      ]);
    }
  };

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

  const invisibleTouchableHandlerStyles: StyleProp<ViewStyle> = useMemo(() => {
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
      <InputWithIcon
        ref={inputRef}
        numberOfLines={1}
        spacingRight={24}
        onFocus={toggleFocused}
        onBlur={toggleFocused}
        iconRight={
          isValidEthAddress ? (
            <Checkmark
              size={moderateScale(24)}
              fillColor={COLORS.success400}
              iconColor={COLORS.neutral0}
              iconScale={0.75}
            />
          ) : (
            <Button onPress={showScanner}>
              <ScannerIcon color={COLORS.brand600} />
            </Button>
          )
        }
        value={maskedValue}
        onChangeValue={onAddressChange}
        placeholder={t('send.funds.recipient')}
      />
      {resetKeyboardState && !isInputFocused && isAndroid && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={onInputPress}
          style={invisibleTouchableHandlerStyles}
        />
      )}
      <BottomSheet
        ref={scannerModalRef}
        borderRadius={0}
        height={WINDOW_HEIGHT}
      >
        <BarcodeScanner onScanned={onQRCodeScanned} onClose={hideScanner} />
      </BottomSheet>
    </>
  );
};
