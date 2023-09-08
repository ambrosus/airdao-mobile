import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { database } from '@database/main';
import { PasscodeModal } from '@components/templates/PasscodeModal';
import { AppState, View } from 'react-native';
import { useAppState } from '@hooks';

interface IPasscodeContext {
  isFaceIDEnabled: boolean;
  authenticate: () => Promise<boolean>;
}

const PasscodeContext = createContext<IPasscodeContext | undefined>(undefined);

export const PasscodeProvider: FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [isFaceIDEnabled, setIsFaceIDEnabled] = useState<boolean>(false);
  const appState = useRef(AppState.currentState);
  const authenticate = async () => {
    try {
      const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with Face ID'
      });
      return success;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
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
    if (isFaceIDEnabled) {
      authenticate();
    }
  }, [isFaceIDEnabled]);

  return (
    <PasscodeContext.Provider value={{ isFaceIDEnabled, authenticate }}>
      <View style={{ flex: 1 }}>
        {focused === 'background' && isFaceIDEnabled ? (
          <PasscodeModal />
        ) : (
          children
        )}
      </View>
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
