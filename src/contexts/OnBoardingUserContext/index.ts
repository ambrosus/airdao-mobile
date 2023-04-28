import { useCallback, useEffect, useState } from 'react';
import { createContextSelector } from '@helpers/createContextSelector';
import { OnBoardingStatus } from '@components/composite/OnBoardingToolTip/OnBoardingToolTip.types';
import { getDataToSecureStore } from '@helpers/storageHelpers';

const OnboardingContext = () => {
  const [status, setStatus] = useState<OnBoardingStatus>('step-1');

  useEffect(() => {
    const getDataGroups = async () => {
      const step = await getDataToSecureStore('UserOnboardingSteps');
      // @ts-ignore
      setStatus(step || 'step-1');
    };
    getDataGroups();
  }, []);
  // setDataToSecureStore('UserOnboardingSteps', 'step-1');

  const handleStepChange = useCallback((nextStep: OnBoardingStatus) => {
    setStatus(nextStep);
    // setDataToSecureStore('UserOnboardingSteps', nextStep);
  }, []);

  const handleSkipTutorial = useCallback(() => {
    setStatus('none');
  }, []);

  console.log(status);

  return {
    status,
    handleStepChange,
    handleSkipTutorial
  };
};

export const [OnboardingContextProvider, useOnboardingStatus] =
  createContextSelector(OnboardingContext);
