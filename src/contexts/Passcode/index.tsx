import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { PasscodeModal } from '@components/templates/PasscodeModal';
import { BottomSheetRef } from '@components/composite';
import { useAppState } from '@hooks';
import { View } from 'react-native';
import { PasscodeUtils } from '@utils/passcode';

interface IPasscodeContext {
  isFaceIDEnabled: boolean;
  isPasscodeEnabled: boolean;
  setSavedPasscode: React.Dispatch<React.SetStateAction<string[]>>;
  savedPasscode: string[];
}

const PasscodeContext = createContext<IPasscodeContext | undefined>(undefined);

export const PasscodeProvider: FC<{ children: React.ReactNode }> = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [isFaceIDEnabled, setIsFaceIDEnabled] = useState<boolean>(false);
  const [isPasscodeEnabled, setIsPasscodeEnabled] = useState<boolean>(false);
  const [savedPasscode, setSavedPasscode] = useState<string[]>([]);
  const passcodeModalRef = useRef<BottomSheetRef>(null);
  const { prevState, appState } = useAppState();

  useEffect(() => {
    Promise.all([
      PasscodeUtils.getPasscodeFromDB(),
      PasscodeUtils.getFaceIDStatusFromDB()
    ]).then(([passcodeRes, faceIDRes]) => {
      setIsPasscodeEnabled(!!passcodeRes);
      setIsFaceIDEnabled(!!faceIDRes);
      setSavedPasscode(passcodeRes as string[]);
    });
  }, [appState]);

  useEffect(() => {
    if (
      (prevState === 'background' || prevState === null) &&
      (isFaceIDEnabled || isPasscodeEnabled)
    ) {
      passcodeModalRef.current?.show();
    }
  }, [isFaceIDEnabled, isPasscodeEnabled, prevState]);

  useEffect(() => {
    if (savedPasscode?.length === 4) {
      PasscodeUtils.setPasscodeInDB(savedPasscode);
    }
  }, [savedPasscode]);

  return (
    <PasscodeContext.Provider
      value={{
        isPasscodeEnabled,
        isFaceIDEnabled,
        savedPasscode,
        setSavedPasscode
      }}
    >
      {isPasscodeEnabled && (
        <PasscodeModal
          ref={passcodeModalRef}
          isPasscodeEnabled={isPasscodeEnabled}
          isFaceIDEnabled={isFaceIDEnabled}
        />
      )}
      <View style={{ flex: 1 }}>{children}</View>
    </PasscodeContext.Provider>
  );
};

export default function usePasscode() {
  const context = useContext(PasscodeContext);
  if (!context) {
    throw new Error();
  }
  return context;
}
