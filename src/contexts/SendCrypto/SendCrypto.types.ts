export interface SendCryptoContextState {
  ui: {
    uiType: string; // DEFAULT "ACCOUNT_SCREEN"
    addressTo: string;
    addressName: string;
    memo: string;
    cryptoValue: string;
    cryptoValueRecounted: number;
    comment: string;
    rawOnly: boolean;
    isTransferAll: boolean;
    dexCurrencyCode: boolean;
    dexOrderData: boolean;
    bse: {
      bseProviderType: boolean;
      bseOrderId: boolean;
      bseMinCrypto: boolean;
      bseTrusteeFee: boolean;
      bseOrderData: boolean;
    };
    tbk: {
      transactionBoost: boolean;
      transactionAction: boolean;
    };
    fioRequestDetails: boolean;
  };
  dict: {
    inputType: string; // default "CRYPTO"
    decimals: string;
    extendsProcessor: string;
    addressUiChecker: string;
    network: string;
    addressFrom: string;
    currencySymbol: string;
    currencyName: string;
    currencyCode: string;
    balanceTotalPretty: string;
    basicCurrencyBalanceTotal: string;
    basicCurrencySymbol: string;
    basicCurrencyCode: string;
    basicCurrencyRate: string;
  };
  fromBlockchain: {
    neverCounted: boolean;
    countedFees: {
      fees: number[];
      selectedFeeIndex: number; // DEFAULT -10
    };
    selectedFee: boolean;
    transferAllBalance: boolean;
  };
}

type SendCryptoActionType =
  | 'SET_DATA'
  | 'RESET_DATA_BLOCKCHAIN'
  | 'RESET_DATA'
  | 'CLEAN_DATA';

export type SendCryptoDispatchPayload = Partial<SendCryptoContextState> & {
  type: SendCryptoActionType;
};

export type SendCryptoDispatch = (payload: SendCryptoDispatchPayload) => void;
