import analytics from '@react-native-firebase/analytics';
import { CustomAppEvents } from '@lib/firebaseEventAnalytics/constants/CustomAppEvents';

/**
 * Sends an analytics event to Firebase Analytics.
 * This function is disabled in development environment (__DEV__).
 *
 * @param {CustomAppEvents} event - The event name to log (from CustomAppEvents enum)
 * @param {object} [params] - Optional parameters to include with the event
 *
 * @example
 * // Log event without parameters
 * sendFirebaseEvent(CustomAppEvents.USER_LOGIN);
 *
 * // Log event with parameters
 * sendFirebaseEvent(CustomAppEvents.PURCHASE, {
 *   price: 99.99,
 *   currency: 'USD'
 * });
 */
export const sendFirebaseEvent = (event: CustomAppEvents, params?: object) => {
  if (!event || __DEV__) return;
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
