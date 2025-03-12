/**
 * For sorting the display order of the product queue on the 'Products' screen,
 * change the arrangement on PRODUCT_SEQUENCE of the id values.
 * 0 => swap-mobile
 * 1 => bridge-mobile
 * 2 => staking-mobile
 * 3 => kosmos-mobile
 * 4 => harbor -mobile
 * 5 => astra-swap-web
 * 6 => xena-web
 */
export enum ProductSequence {
  Swap = 0,
  Bridge = 1,
  Staking = 2,
  Kosmos = 3,
  Harbor = 4,
  Astra = 5,
  Xena = 6
}

export const PRODUCT_SEQUENCE: number[] = [
  ProductSequence.Swap,
  ProductSequence.Astra,
  ProductSequence.Bridge,
  ProductSequence.Staking,
  ProductSequence.Kosmos,
  ProductSequence.Harbor,
  ProductSequence.Xena
];
