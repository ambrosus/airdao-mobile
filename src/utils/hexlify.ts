import { arrayify, toUtf8String } from 'ethers/lib/utils';

export const fromHexlifyToObject = <T>(hex: string): T => {
  try {
    if (typeof hex !== 'string') {
      throw new TypeError('Input must be a string');
    }

    const utf8String = toUtf8String(arrayify(hex));

    return JSON.parse(utf8String);
  } catch {
    return {} as T;
  }
};
