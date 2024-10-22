import { CustomAppEvents } from '@lib/firebaseEventAnalytics/constants/CustomAppEvents';
import analytics from '@react-native-firebase/analytics';

export const sendFirebaseEvent = (event: CustomAppEvents, params?: object) => {
  if (!event) return;
  const paramsNotEmpty = params && Object.keys(params);

  try {
    if (paramsNotEmpty) {
      analytics().logEvent(event, params).then();
      alert(`${event} event with params ${JSON.stringify(params)} sent`);
    } else {
      alert(`${event} event sent`);
      analytics().logEvent(event).then();
    }
  } catch (e) {
    return e;
  }
};
