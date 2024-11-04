import { ViewStyle } from 'react-native';

type CSSShadow = {
  offsetX: number;
  offsetY: number;
  blurRadius: number;
  spreadRadius: number;
  color: string;
};

function parseCSSShadow(shadow: string): CSSShadow {
  const match = shadow.match(
    /(-?\d+px)\s(-?\d+px)\s(\d+px)\s(\d+px)\srgba?\((\d+),\s*(\d+),\s*(\d+),\s*(\d?.?\d*)\)/
  );

  if (!match) {
    throw new Error('Invalid shadow format');
  }

  return {
    offsetX: parseInt(match[1], 10),
    offsetY: parseInt(match[2], 10),
    blurRadius: parseInt(match[3], 10),
    spreadRadius: parseInt(match[4], 10),
    color: `rgba(${match[5]}, ${match[6]}, ${match[7]}, ${match[8]})`
  };
}

export function cssShadowToNative(shadow: string): ViewStyle {
  const { blurRadius, color } = parseCSSShadow(shadow);

  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: blurRadius,
    elevation: blurRadius
  };
}
