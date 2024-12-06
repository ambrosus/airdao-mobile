import { CustomAppEvents } from '@lib/firebaseEventAnalytics/constants/CustomAppEvents';
import analytics from '@react-native-firebase/analytics';
import { Alert } from 'react-native';

export const sendFirebaseEvent = (event: CustomAppEvents, params?: object) => {
  if (!event || __DEV__) return;
  Alert.alert(`Handle event -> ${JSON.stringify(event)}`);
  const paramsNotEmpty = params && Object.keys(params);

  try {
    if (paramsNotEmpty) {
      analytics().logEvent(event, params).then();
    } else {
      analytics().logEvent(event).then();
    }
  } catch (e) {
    return e;
  }
};
