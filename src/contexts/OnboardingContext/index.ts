import { useRef, useState } from 'react';
import { createContextSelector } from '@utils/createContextSelector';
import { OnboardingContent } from '@constants/onboarding-content';
import { Cache, CacheKey } from '@lib/cache';

const OnboardingContext = () => {
  const [, setStatus] = useState<number>(-1);

  const emptyFn = () => null;
  const backHelper = useRef<() => unknown>(emptyFn);
  const nextHelper = useRef<() => unknown>(emptyFn);
  const skipHelper = useRef<() => unknown>(emptyFn);

  const getOnboardingStatus = async () => {
    const step = parseInt(
      ((await Cache.getItem(CacheKey.Onboarding)) as string) || '1'
    );
    setStatus(step);
  };

  const next = async (currentStep: number) => {
    setStatus(currentStep + 0.5); // hide current tooltip
    const nextStatus = currentStep + 1;
    await nextHelper.current();
    setTimeout(() => {
      setStatus(nextStatus);
      if (nextStatus > OnboardingContent.length) {
        updateLocalStorage(nextStatus);
      }
    }, 500);
  };

  const back = async (currentStep: number) => {
    setStatus(currentStep - 0.5);
    await backHelper.current();
    setTimeout(() => {
      let previous = currentStep - 1;
      if (previous < 0) previous = 0;
      setStatus(previous);
    }, 500);
  };

  const skip = () => {
    setStatus(-1);
    updateLocalStorage(-1);
  };

  const updateLocalStorage = (newStatus: number) => {
    Cache.setItem(CacheKey.Onboarding, newStatus);
  };

  const registerHelpers = ({
    back,
    next,
    skip
  }: {
    back?: () => unknown;
    next?: () => unknown;
    skip?: () => unknown;
  }) => {
    if (back) backHelper.current = back;
    else backHelper.current = emptyFn;
    if (next) nextHelper.current = next;
    else nextHelper.current = emptyFn;
    if (skip) skipHelper.current = skip;
    else skipHelper.current = emptyFn;
  };

  return {
    status: 'none',
    registerHelpers,
    back,
    next,
    skip,
    start: getOnboardingStatus
  };
};

export const [OnboardingContextProvider, useOnboardingStatus] =
  createContextSelector(OnboardingContext);
