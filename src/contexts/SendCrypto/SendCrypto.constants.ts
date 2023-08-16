export const SEND_CRYPTO_INITIAL_STATE = {
  ui: {
    uiType: 'ACCOUNT_SCREEN',
    addressTo: '',
    addressName: '',
    memo: '',
    cryptoValue: '',
    cryptoValueRecounted: 0,
    comment: '',
    rawOnly: false,
    isTransferAll: false,
    dexCurrencyCode: false,
    dexOrderData: false,
    bse: {
      bseProviderType: false,
      bseOrderId: false,
      bseMinCrypto: false,
      bseTrusteeFee: false,
      bseOrderData: false
    },
    tbk: {
      transactionBoost: false,
      transactionAction: false
    },
    fioRequestDetails: false
  },
  dict: {
    inputType: 'CRYPTO',
    decimals: '',
    extendsProcessor: '',
    addressUiChecker: '',
    network: '',
    addressFrom: '',
    currencySymbol: '',
    currencyName: '',
    currencyCode: '',
    balanceTotalPretty: '',
    basicCurrencyBalanceTotal: '',
    basicCurrencySymbol: '',
    basicCurrencyCode: '',
    basicCurrencyRate: ''
  },
  fromBlockchain: {
    neverCounted: true,
    countedFees: {
      fees: [],
      selectedFeeIndex: -10
    },
    selectedFee: false,
    transferAllBalance: false
  }
};
