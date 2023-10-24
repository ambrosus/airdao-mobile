import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from '@appTypes';
import { useAppState } from './useAppState';
import usePasscode from '@contexts/Passcode';

export const usePasscodeEntryRevealer = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const { prevState } = useAppState();
  const { isPasscodeEnabled, isFaceIDEnabled, loading } = usePasscode();
  useEffect(() => {
    if (!loading) {
      if (
        (prevState === null || prevState === 'background') &&
        (isPasscodeEnabled || isFaceIDEnabled)
      ) {
        navigation.navigate('Passcode');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, prevState, loading]);
};
