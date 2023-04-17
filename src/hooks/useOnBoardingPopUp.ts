import {
  OnBoardingStatus,
  PopUpOnboardingProps
} from '@components/composite/PopUpOnBoarding/PopUpOnBoarding.types';
import { initialOnBoardingSteps } from '@contexts/OnBoardingUserContext/OnboardingStepsInfo';

export const useOnboardingPopUp = (
  step: OnBoardingStatus
): PopUpOnboardingProps => {
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
