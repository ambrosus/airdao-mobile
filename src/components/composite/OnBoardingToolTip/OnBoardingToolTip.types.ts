export type OnBoardingStatus =
  | 'none'
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

export interface OnBoardingToolTipInfo {
  title: string;
  subtitle: string;
  buttonLeft: string;
  isButtonLeftVisible?: boolean;
  buttonRight: string;
  isButtonClose: boolean;
}
