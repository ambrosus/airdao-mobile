import { useEffect } from 'react';
import { usePasscodeStore } from '@features/passcode/model';
import { PasscodeUtils } from '@utils';

export function usePasscodeInit() {
  const {
    onChangePasscode,
    onChangeIsFaceIDEnabled,
    onChangeIsPasscodeEnabled,
    onToggleLoading
  } = usePasscodeStore();

  useEffect(() => {
    onToggleLoading(true);
    Promise.all([
      PasscodeUtils.getPasscodeFromDB(),
      PasscodeUtils.getFaceIDStatusFromDB()
    ])
      .then(([passcodeRes, faceIDRes]) => {
        onChangeIsPasscodeEnabled(passcodeRes?.length > 0);
        onChangeIsFaceIDEnabled(faceIDRes);
        onChangePasscode(passcodeRes as string[]);
        onToggleLoading(false);
      })
      .catch(() => onToggleLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
