export enum Social {
  Twitter = 'twitter'
}

export interface SharingOptions {
  title: string;
  message?: string;
}

export interface SharingOptionsWithMedia extends SharingOptions {
  uri?: string;
  base64: string;
}
