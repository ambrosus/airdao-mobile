import { Cache, CacheKey } from '@lib/cache';
import { UUID_UTILS } from '@utils/uuid';

export class DeviceService {
  static deviceID: string;

  static async setupUniqueDeviceID() {
    const deviceID =
      (await UUID_UTILS.getDeviceID()) || UUID_UTILS.generateRandomUUID();
    this.deviceID = deviceID;
    await Cache.setItem(CacheKey.DeviceID, deviceID);
  }

  static getDeviceID() {
    return this.deviceID;
  }
}
