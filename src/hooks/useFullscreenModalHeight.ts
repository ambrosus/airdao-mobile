import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useFullscreenModalHeight = (): number => {
  const { height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  return height - top;
};
