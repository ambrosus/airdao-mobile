import {
  OnBoardingStatus,
  OnBoardingToolTipInfo
} from '@components/composite/OnBoardingToolTip/OnBoardingToolTip.types';
import { initialOnBoardingSteps } from '@contexts/OnBoardingUserContext/OnboardingStepsInfo';

export const useOnboardingToolTip = (
  step: OnBoardingStatus
): OnBoardingToolTipInfo => {
  const stepData = initialOnBoardingSteps[step];

  return {
    title: stepData.title,
    subtitle: stepData.subtitle,
    buttonLeft: stepData.buttonLeft,
    buttonRight: stepData.buttonRight,
    isButtonClose: stepData.isButtonClose,
    isButtonLeftVisible: stepData.isButtonLeftVisible
  };
};
