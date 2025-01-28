import { COLORS } from '@constants/colors';

export function $discount(_discount?: number) {
  if (!_discount) return '-';
  return +_discount.toFixed(2) === 0 ? '-' : _discount.toFixed(2) + '%';
}

export function discountColor(discount: number | string | undefined): string {
  if (discount === '-' || discount === undefined) {
    return COLORS.error400;
  }

  const numericDiscount = typeof discount === 'string' ? NaN : discount;

  return !Number.isNaN(numericDiscount) && numericDiscount > 0
    ? COLORS.success500
    : COLORS.error400;
}
