import { useCallback, useEffect, useState } from 'react';
import { createContextSelector } from '@helpers/createContextSelector';
import { OnBoardingStatus } from '@components/composite/PopUpOnBoarding/PopUpOnBoarding.types';
import {
  getDataToSecureStore,
  setDataToSecureStore
} from '@helpers/storageHelpers';

const OnboardingContext = () => {
  const [status, setStatus] = useState<OnBoardingStatus | ''>('');

  useEffect(() => {
    const getDataGroups = async () => {
      const step = await getDataToSecureStore('UserOnboardingSteps');
      // @ts-ignore
      setStatus(step || '');
    };
    getDataGroups();
  }, []);

  const handleStepChange = useCallback((step: OnBoardingStatus | '') => {
    setStatus(step);
    setDataToSecureStore('UserOnboardingSteps', step);
  }, []);

  return {
    status,
    handleStepChange
  };
};

export const [OnboardingContextProvider, useOnboardingStatus] =
  createContextSelector(OnboardingContext);
