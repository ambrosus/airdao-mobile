import { DeviceEventEmitter } from 'react-native';
import { AirDAOEventPayload, AirDAOEventType } from '@appTypes';

export class AirDAOEventDispatcher {
  static dispatch(type: AirDAOEventType, payload: AirDAOEventPayload) {
    DeviceEventEmitter.emit(type, payload);
  }

  static subscribe(
    type: AirDAOEventType,
    callback: (payload: AirDAOEventPayload) => unknown
  ) {
    const listener = DeviceEventEmitter.addListener(type, callback);
    return { unsubscribe: listener.remove };
  }
}
