import { create } from 'zustand';

interface PasscodeStore {
  passcode: string[];
  isFaceIDEnabled: boolean;
  isPasscodeEnabled: boolean;
  loading: boolean;
  // Actions
  onChangeIsFaceIDEnabled: (payload: boolean) => void;
  onChangeIsPasscodeEnabled: (payload: boolean) => void;
  onToggleLoading: (payload: boolean) => void;
  onChangePasscode: (payload: string[]) => void;
}

export const usePasscodeStore = create<PasscodeStore>((set) => ({
  passcode: [],
  isFaceIDEnabled: false,
  isPasscodeEnabled: false,
  loading: false,
  onChangeIsFaceIDEnabled: (payload: boolean) => {
    set({ isFaceIDEnabled: payload });
  },
  onChangeIsPasscodeEnabled: (payload: boolean) => {
    set({ isPasscodeEnabled: payload });
  },
  onToggleLoading: (payload: boolean) => {
    set({ loading: payload });
  },
  onChangePasscode: (payload: string[]) => {
    set({ passcode: payload });
  }
}));
