import { parseCSSShadow, cssShadowToNative } from '@utils/css-shadow-to-native';

describe('parseCSSShadow', () => {
  it('should parse a valid CSS shadow string', () => {
    const shadow = '10px 10px 5px 0px rgba(0, 0, 0, 0.5)';
    const result = parseCSSShadow(shadow);
    expect(result).toEqual({
      offsetX: 10,
      offsetY: 10,
      blurRadius: 5,
      spreadRadius: 0,
      color: 'rgba(0, 0, 0, 0.5)'
    });
  });

  it('should throw an error for an invalid shadow string', () => {
    const shadow = 'invalid shadow string';
    expect(() => parseCSSShadow(shadow)).toThrow('Invalid shadow format');
  });
});

describe('cssShadowToNative', () => {
  it('should convert CSS shadow to native style', () => {
    const shadow = '10px 10px 5px 0px rgba(0, 0, 0, 0.5)';
    const result = cssShadowToNative(shadow);
    expect(result).toEqual({
      shadowColor: 'rgba(0, 0, 0, 0.5)',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: 5,
      elevation: 5
    });
  });
});
