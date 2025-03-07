import { Alert } from 'react-native';

interface ShowConfirmationModel {
  header?: string;
  message?: string;
  reject: () => void;
  resolve: () => void;
  cancelable?: boolean;
}

export const requestUserApproval = async ({
  header = 'Confirmation',
  message = '',
  reject,
  resolve,
  cancelable = false
}: ShowConfirmationModel) => {
  return Alert.alert(
    header,
    message,
    [
      {
        text: 'Cancel',
        onPress: reject,
        style: 'cancel'
      },
      {
        text: 'Sign',
        onPress: resolve,
        style: 'default'
      }
    ],
    { cancelable }
  );
};
