declare type ExtensionValue = string | number | boolean | null | undefined;

export interface TokenInfo {
  readonly chainId: number;
  readonly address: string;
  readonly name: string;
  readonly decimals: number;
  readonly symbol: string;
  readonly logoURI?: string;
  readonly tags?: string[];
  readonly extensions?: {
    readonly [key: string]:
      | {
          [key: string]:
            | {
                [key: string]: ExtensionValue;
              }
            | ExtensionValue;
        }
      | ExtensionValue;
  };
}

export interface Version {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
}

export interface Tags {
  readonly [tagId: string]: {
    readonly name: string;
    readonly description: string;
  };
}

type TagDetails = Tags[keyof Tags];
export interface TagInfo extends TagDetails {
  id: string;
}

export interface TokenList {
  readonly name: string;
  readonly version: Version;
  readonly default: {
    production: TokenInfo;
    testnet: TokenInfo;
  };
  readonly tokens: {
    production: TokenInfo[];
    testnet: TokenInfo[];
  };
  readonly keywords?: string[];
  readonly tags?: Tags;
  readonly logoURI?: string;
}
