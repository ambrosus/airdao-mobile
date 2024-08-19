import { COLORS } from '@constants/colors';

export function discountColor(discount: number) {
  return discount > 0 ? COLORS.success600 : COLORS.error600;
}
