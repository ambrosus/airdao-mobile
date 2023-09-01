import React, { useRef } from 'react';
import { Alert, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BarcodeScanner } from '@components/templates';
import {
  BottomSheet,
  BottomSheetRef,
  InputWithIcon
} from '@components/composite';
import { Button, InputRef } from '@components/base';
import { ScannerIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { etherumAddressRegex } from '@constants/regex';

interface AddressInputProps {
  address: string;
  onAddressChange: (newAddress: string) => unknown;
}
export const AddressInput = (props: AddressInputProps) => {
  const { address, onAddressChange } = props;
  const { t } = useTranslation();
  const { height: WINDOW_HEIGHT } = useWindowDimensions();
  const scannerModalRef = useRef<BottomSheetRef>(null);
  const scanned = useRef(false);
  const inputRef = useRef<InputRef>(null);

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
      Alert.alert(t('invalid.qr.code.msg'), '', [
        {
          text: t('scan.again.msg'),
          onPress: () => {
            scanned.current = false;
          }
        }
      ]);
    }
  };

  return (
    <>
      <InputWithIcon
        ref={inputRef}
        iconRight={
          <Button onPress={showScanner}>
            <ScannerIcon color={COLORS.blue600} />
          </Button>
        }
        value={address}
        onChangeValue={onAddressChange}
      />
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
