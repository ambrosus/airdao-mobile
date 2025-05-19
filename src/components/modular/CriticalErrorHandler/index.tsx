import { useEffect, useRef } from 'react';
import { BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomSheetRef } from '@components/composite';
import { useGlobalErrorStore } from '@entities/global-error/global-error-store';
import { BottomSheetCriticalError } from '@features/harbor/components/templates/bottom-sheet-critical-error';

// Глобальна функція для показу критичної помилки через zustand store
export function showCriticalError({
  title,
  message
}: {
  title: string;
  message: string;
}) {
  useGlobalErrorStore.getState().setError({ title, message });
}

export const CriticalErrorHandler: React.FC = () => {
  const localRef = useRef<BottomSheetRef>(null);
  const navigation = useNavigation();
  const error = useGlobalErrorStore((state) => state.error);
  const clearError = useGlobalErrorStore((state) => state.clearError);

  useEffect(() => {
    if (error && localRef.current) {
      localRef.current.show({
        title: error.title,
        subTitle: error.message,
        buttonsLabels: ['Go Back']
      });
    }
  }, [error]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (error) {
          navigation.goBack();
          clearError();
          return true;
        }
        return false;
      }
    );
    return () => backHandler.remove();
  }, [navigation, error, clearError]);

  const handleClose = () => {
    clearError();
  };

  return (
    <BottomSheetCriticalError
      title={error?.title || ''}
      message={error?.message || ''}
      ref={localRef}
      onClose={handleClose}
    />
  );
};
