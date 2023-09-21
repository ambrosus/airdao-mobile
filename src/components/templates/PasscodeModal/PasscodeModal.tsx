import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useState
} from 'react';
import { Button, KeyboardDismissingView, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { Dimensions, KeyboardAvoidingView, View } from 'react-native';
import { Passcode } from '@components/base/Passcode/Passcode';
import { database } from '@database/main';
import {
  BottomSheet,
  BottomSheetProps,
  BottomSheetRef
} from '@components/composite';
import { useForwardedRef } from '@hooks';
import { CloseIcon } from '@components/svg/icons';
import { verticalScale } from '@utils/scaling';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '@components/templates/PasscodeModal/styles';

interface PasscodeModalProps {
  isPasscodeEnabled: boolean;
}

export const PasscodeModal = forwardRef<
  BottomSheetRef,
  BottomSheetProps & PasscodeModalProps
>((props, ref) => {
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const { top } = useSafeAreaInsets();
  const { isPasscodeEnabled } = props;
  const [savedPasscode, setSavedPasscode] = useState([]);
  const [userPasscode, setUserPasscode] = useState<string[]>([]);

  useEffect(() => {
    // @ts-ignore
    database.localStorage.get('Passcode').then((res) => setSavedPasscode(res));
  }, []);

  const handlePasscode = (typedPasscode: string[]) => {
    setUserPasscode(typedPasscode);
  };

  const dismiss = useCallback(() => {
    localRef.current?.dismiss();
  }, [localRef]);

  useEffect(() => {
    if (JSON.stringify(savedPasscode) === JSON.stringify(userPasscode)) {
      localRef.current?.dismiss();
    }
  }, [localRef, userPasscode, savedPasscode]);

  return (
    <BottomSheet
      ref={localRef}
      containerStyle={styles.container}
      height={Dimensions.get('screen').height}
    >
      {isPasscodeEnabled && (
        <>
          <View style={[{ top }, styles.button]}>
            <Button onPress={dismiss}>
              <CloseIcon />
            </Button>
          </View>
          <KeyboardAvoidingView
            behavior="padding"
            style={{
              top,
              flex: 1
            }}
          >
            <KeyboardDismissingView>
              <Text
                fontSize={24}
                fontFamily="Inter_700Bold"
                color={COLORS.nero}
                align="center"
                style={{ paddingTop: verticalScale(160) }}
              >
                Enter your passcode
              </Text>
              <Spacer value={verticalScale(24)} />
              <Passcode onPasscodeChange={handlePasscode} />
            </KeyboardDismissingView>
          </KeyboardAvoidingView>
        </>
      )}
    </BottomSheet>
  );
});
