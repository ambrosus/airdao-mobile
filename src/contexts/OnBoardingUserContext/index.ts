import { useCallback, useEffect, useState } from 'react';
import { createContextSelector } from '@helpers/createContextSelector';
import { OnBoardingStatus } from '@components/composite/OnBoardingToolTip/OnBoardingToolTip.types';
import { getDataToSecureStore } from '@helpers/storageHelpers';

const OnboardingContext = () => {
  const [status, setStatus] = useState<OnBoardingStatus>('none');

  useEffect(() => {
    const getDataGroups = async () => {
      const step = await getDataToSecureStore('UserOnboardingSteps');
      // @ts-ignore
      setStatus(step || 'none');
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

  return {
    status,
    handleStepChange,
    handleSkipTutorial
  };
};

export const [OnboardingContextProvider, useOnboardingStatus] =
  createContextSelector(OnboardingContext);
