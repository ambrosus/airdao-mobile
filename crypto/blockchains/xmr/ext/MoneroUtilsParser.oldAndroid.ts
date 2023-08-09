/**
 * @author Ksu
 * @version 0.11
 * for old androids
 */

export default {
  checkDestination(value: any) {
    return false;
  },

  async getCore() {
    return false;
  },

  async getCoreWasm() {
    return false;
  },

  async parseAddressInfo(
    address: string,
    data: {},
    privViewKey: string,
    pubSpendKey: string,
    privSpendKey: string
  ) {
    return false;
  },

  async parseAddressTransactions(
    address: string,
    data: {},
    privViewKey: string,
    pubSpendKey: string,
    privSpendKey: string
  ) {
    return false;
  }
};
