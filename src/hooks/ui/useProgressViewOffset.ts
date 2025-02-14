import { useState, useRef, useEffect } from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const selectHook = <T>({
  useDefault,
  useAndroid
}: {
  useDefault: T;
  useAndroid: T;
}) => {
  return Platform.select({
    default: useDefault,
    android: useAndroid
  });
};

/**
 * Quick workaround for refreshing issue on Android:
 * The refresh control is showing up above the header when unmounting the screen.
 */
export const useProgressViewOffset = selectHook({
  useDefault: (offset?: number) => offset,
  useAndroid: (offset?: number) => {
    const navigation = useNavigation();
    const [progressViewOffset, setProgressViewOffset] = useState(offset);
    const goBackEventWasHandled = useRef(false);

    // prevent the navigation event and hide the refresh indicator
    useEffect(() => {
      const unsubscribe = navigation.addListener('beforeRemove', (event) => {
        // Handle GO_BACK event only, because it fits my use case, please tweak it to fit yours
        if (
          event.data.action.type === 'GO_BACK' &&
          !goBackEventWasHandled.current
        ) {
          event.preventDefault();
          goBackEventWasHandled.current = true;
          setProgressViewOffset(-1000); // set to a ridiculous value to hide the refresh control
        }
      });

      return unsubscribe;
    }, [navigation]);

    // perform the navigation with the hidden refresh indicator
    useEffect(() => {
      if (progressViewOffset !== undefined && goBackEventWasHandled.current) {
        navigation.goBack();
      }
    }, [navigation, progressViewOffset]);

    return progressViewOffset;
  }
});
