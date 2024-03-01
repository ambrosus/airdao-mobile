import { createContextSelector } from '@utils/createContextSelector';

const NavigationContext = ({ currentRoute }: { currentRoute: string }) => {
  return {
    currentRoute: currentRoute
  };
};

export const [NavigationProvider, useNavigationContext] =
  createContextSelector(NavigationContext);

export const useCurrentRoute = () => {
  return useNavigationContext((v) => v.currentRoute);
};
