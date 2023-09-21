import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { database } from '@database/main';
import {
  FaceIDModal,
  PasscodeModal
} from '@components/templates/PasscodeModal';
import { BottomSheetRef } from '@components/composite';
import { useAppState } from '@hooks';

interface IPasscodeContext {
  isFaceIDEnabled: boolean;
  isPasscodeEnabled: boolean;
}

const PasscodeContext = createContext<IPasscodeContext | undefined>(undefined);

export const PasscodeProvider: FC<{ children: React.ReactNode }> = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [isFaceIDEnabled, setIsFaceIDEnabled] = useState(false);
  const [isPasscodeEnabled, setIsPasscodeEnabled] = useState(false);
  const passcodeModalRef = useRef<BottomSheetRef>(null);
  const faceIDModalRef = useRef<BottomSheetRef>(null);

  const { prevState } = useAppState();

  useEffect(() => {
    Promise.all([
      database.localStorage.get('Passcode'),
      database.localStorage.get('FaceID')
    ]).then(([passcodeRes, faceIDRes]) => {
      setIsPasscodeEnabled(!!passcodeRes);
      setIsFaceIDEnabled(!!faceIDRes);
    });
  }, []);

  useEffect(() => {
    if (prevState === 'background') {
      if (isFaceIDEnabled) {
        faceIDModalRef.current?.show();
      }
      if (isPasscodeEnabled) {
        passcodeModalRef.current?.show();
      }
    }
  }, [isFaceIDEnabled, isPasscodeEnabled, prevState]);

  return (
    <PasscodeContext.Provider value={{ isPasscodeEnabled, isFaceIDEnabled }}>
      {children}
      {isPasscodeEnabled && !isFaceIDEnabled && (
        <PasscodeModal
          ref={passcodeModalRef}
          isPasscodeEnabled={isPasscodeEnabled}
        />
      )}
      {isFaceIDEnabled && (
        <FaceIDModal ref={faceIDModalRef} isFaceIDEnabled={isFaceIDEnabled} />
      )}
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
