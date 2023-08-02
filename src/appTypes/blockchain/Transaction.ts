export interface BlockchainTransaction {
  hex: string;
  address: string;
  vin: {
    txid: string;
    sequence: string;
    n: number;
    addresses: string[];
    addr: string;
    value: string;
    hex: string;
    prevout: {
      scriptpubkey_address: string;
      value: string;
    };
  }[];
  vout: {
    value: string;
    n: number;
    spent: string;
    hex: string;
    addresses: string[];
    scriptPubKey: { addresses: string[] };
    scriptpubkey_address: string;
    prevout: {
      scriptpubkey_address: string;
      value: string;
    };
  }[];
}
