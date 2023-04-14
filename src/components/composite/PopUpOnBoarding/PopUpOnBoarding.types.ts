export enum PopUpPlacement {
  TOP = 'top',
  RIGHT = 'right',
  BOTTOM = 'bottom',
  LEFT = 'left',
  CENTER = 'center'
}

export type OnBoardingStatus =
  | 'step-1'
  | 'step-2'
  | 'step-3'
  | 'step-4'
  | 'step-5'
  | 'step-6'
  | 'step-7'
  | 'step-8'
  | 'step-9'
  | 'step-10'
  | 'step-11'
  | 'step-12';

export type OnBoardingStepsType = {
  OnBoardingStatus: PopUpOnboardingProps;
};

export type OnBoardingStep = {
  title: string;
  subtitle: string;
  buttonLeft: () => void;
  buttonRight: () => void;
  isButtonClose: boolean;
};
export interface PopUpOnboardingProps {
  title: string;
  subtitle: string;
  buttonLeft: string;
  buttonRight: string;
  isButtonClose: boolean;
}
