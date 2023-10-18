import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState
} from 'react';
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

  useEffect(() => {
    Promise.all([
      PasscodeUtils.getPasscodeFromDB(),
      PasscodeUtils.getFaceIDStatusFromDB()
    ]).then(([passcodeRes, faceIDRes]) => {
      setIsPasscodeEnabled(!!passcodeRes);
      setIsFaceIDEnabled(!!faceIDRes);
      setSavedPasscode(passcodeRes as string[]);
    });
  }, []);

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
