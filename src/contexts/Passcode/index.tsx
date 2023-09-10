import React, {
  createContext,
  FC,
  ForwardedRef,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { database } from '@database/main';
import { PasscodeModal } from '@components/templates/PasscodeModal';
import { AppState, Modal, View } from 'react-native';
import { useAppState, useForwardedRef } from '@hooks';
import { BottomSheetRef } from '@components/composite';

interface IPasscodeContext {
  isFaceIDEnabled: boolean;
}

const PasscodeContext = createContext<IPasscodeContext | undefined>(undefined);

export const PasscodeProvider: FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [isFaceIDEnabled, setIsFaceIDEnabled] = useState<boolean>(false);
  const [accessed, setAccessed] = useState<boolean>(false);
  const appState = useRef(AppState.currentState);
  const passcodeRef: ForwardedRef<BottomSheetRef> = useForwardedRef(null);

  const authenticate = async () => {
    try {
      const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with Face ID'
      });
      setAccessed(success);
      // if (success) {
      //   passcodeRef.current?.dismiss();
      // }
    } catch (error) {
      console.error('Authentication error:', error);
      setAccessed(false);
    }
  };

  const focused = useAppState();

  const checkFaceIDStatus = async () => {
    const storedFaceID = await database.localStorage.get('FaceID');
    setIsFaceIDEnabled(!!storedFaceID);
  };

  useEffect(() => {
    AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        checkFaceIDStatus();
      }

      appState.current = nextAppState;
    });
  }, []);

  useEffect(() => {
    if (!accessed && focused === 'active') {
      if (isFaceIDEnabled) {
        (async () => {
          await authenticate();
        })();
      }
      // else {
      //   passcodeRef.current?.show();
      // }
    }
  }, [accessed, focused, isFaceIDEnabled, passcodeRef]);

  useEffect(() => {
    if (focused === 'background') {
      setAccessed(false);
    }
  }, [focused]);

  // useEffect(() => {
  //   if (accessed) {
  //     passcodeRef.current?.dismiss();
  //   }
  // }, [accessed, passcodeRef]);

  return (
    <PasscodeContext.Provider value={{ isFaceIDEnabled }}>
      {/*{isFaceIDEnabled && focused === 'background' && accessed ? (*/}
      {/*  <PasscodeModal />*/}
      {/*) : (*/}
      {/*  <View style={{ flex: 1 }}>*/}
      {children}
      {/*</View>*/}
      {/*)}*/}
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
