/**
 * @version 0.41
 */

/**
 * @param address
 * @returns {boolean}
 */
export const isUnstoppableAddressValid = (address: string) => {
  if (address) {
    try {
      return /^.+\.crypto$/.test(address);
    } catch (e) {
      console.log(e);
    }
  }
  return false;
};
