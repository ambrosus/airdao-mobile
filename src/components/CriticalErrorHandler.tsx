import { createRef, useRef, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomSheetRef } from '@components/composite';
import { BottomSheetCriticalError } from '@features/harbor/components/templates/bottom-sheet-critical-error';

// Create a global ref to have access from anywhere
export const errorSheetRef = createRef<BottomSheetRef>();

// Global error display toggle
let _errorVisible = false;
let _errorTitle = '';
let _errorMessage = '';

// Function to show error from anywhere in the code
export function showCriticalError({
  message,
  title
}: {
  message: string;
  title: string;
}): void {
  _errorTitle = title;
  _errorMessage = message;
  _errorVisible = true;

  // If ref exists, show modal window
  if (errorSheetRef.current) {
    errorSheetRef.current.show({
      title: _errorTitle,
      subTitle: _errorMessage,
      buttonsLabels: ['Go Back']
    });
  }
}

/**
 * Component for handling critical errors
 * Use in the root component of the application
 */
export const CriticalErrorHandler: React.FC = () => {
  const localRef = useRef<BottomSheetRef>(null);
  const navigation = useNavigation();

  // Connect local ref to global
  useEffect(() => {
    if (localRef.current) {
      // @ts-ignore - pass local ref methods to global
      errorSheetRef.current = localRef.current;
    }
  }, []);

  // Handle back button press when modal is open
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (_errorVisible) {
          navigation.goBack();
          _errorVisible = false;
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [navigation]);

  // Show modal if there is an error
  useEffect(() => {
    if (_errorVisible && localRef.current) {
      localRef.current.show({
        title: _errorTitle,
        subTitle: _errorMessage,
        buttonsLabels: ['Go Back']
      });
    }
  }, []);

  const handleClose = () => {
    _errorVisible = false;
  };

  return (
    <BottomSheetCriticalError
      title={_errorTitle}
      message={_errorMessage}
      ref={localRef}
      onClose={handleClose}
    />
  );
};
