import { RefObject, useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

export function useSwipeableDismissListener(
  key: string,
  idToCompare: string,
  swipeableRef: RefObject<Swipeable>
) {
  useEffect(() => {
    const listener = DeviceEventEmitter.addListener(
      key,
      (id: string) => id !== idToCompare && swipeableRef.current?.close()
    );
    return () => listener.remove();
  }, [idToCompare, key, swipeableRef]);
}
