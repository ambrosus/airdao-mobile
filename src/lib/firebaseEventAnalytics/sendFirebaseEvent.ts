import { CustomAppEvents } from '@lib/firebaseEventAnalytics/constants/CustomAppEvents';
import analytics from '@react-native-firebase/analytics';

export const sendFirebaseEvent = (event: CustomAppEvents, params?: object) => {
  if (!event) return;
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
