import { InteractionManager } from 'react-native';

export const _delayNavigation = async <T extends (...args: any[]) => void>(
  dismissBottomSheet: () => void,
  navigate: T,
  ...navigateArgs: Parameters<T>
): Promise<void> => {
  dismissBottomSheet();

  InteractionManager.runAfterInteractions(async () => {
    await delay(320);
    navigate(...navigateArgs);
  });
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
