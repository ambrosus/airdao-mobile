import { useCallback, useEffect, useState } from 'react';
import { createContextSelector } from '@helpers/createContextSelector';
import { OnBoardingStatus } from '@components/composite/OnBoardingToolTip/OnBoardingToolTip.types';
import {
  getDataToSecureStore,
  setDataToSecureStore
} from '@helpers/storageHelpers';

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

  const handleStepChange = useCallback((nextStep: OnBoardingStatus) => {
    setStatus(nextStep);
    setDataToSecureStore('UserOnboardingSteps', nextStep);
  }, []);

  return {
    status,
    handleStepChange
  };
};

export const [OnboardingContextProvider, useOnboardingStatus] =
  createContextSelector(OnboardingContext);
