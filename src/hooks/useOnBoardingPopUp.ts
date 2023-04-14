import { initialOnBoardingSteps } from '@contexts/OnBoardingUserContext';
import {
  OnBoardingStatus,
  PopUpOnboardingProps
} from '@components/composite/PopUpOnBoarding/PopUpOnBoarding.types';

export const useOnboardingPopUp = (
  step: OnBoardingStatus
): PopUpOnboardingProps => {
  const stepData = initialOnBoardingSteps[step];

  return {
    title: stepData.title,
    subtitle: stepData.subtitle,
    buttonLeft: stepData.buttonLeft,
    buttonRight: stepData.buttonRight,
    isButtonClose: !stepData.isButtonClose
  };
};
