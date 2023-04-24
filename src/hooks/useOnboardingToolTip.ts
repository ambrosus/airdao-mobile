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
    buttonLeftTitle: stepData.buttonLeftTitle,
    buttonRightTitle: stepData.buttonRightTitle,
    isButtonClose: stepData.isButtonClose,
    isButtonLeftVisible: stepData.isButtonLeftVisible
  };
};
