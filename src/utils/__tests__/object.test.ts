import { getObjectKeyByValue } from '@utils/object';

describe('getObjectKeyByValue', () => {
  it('should return the correct key for a given value', () => {
    const obj = { a: 'apple', b: 'banana', c: 'cherry' };
    expect(getObjectKeyByValue(obj, 'banana')).toBe('b');
  });

  it('should return undefined for a value that does not exist', () => {
    const obj = { a: 'apple', b: 'banana', c: 'cherry' };
    expect(getObjectKeyByValue(obj, 'orange')).toBeUndefined();
  });

  it('should return undefined for an empty object', () => {
    const obj = {};
    expect(getObjectKeyByValue(obj, 'anyValue')).toBeUndefined();
  });
});
