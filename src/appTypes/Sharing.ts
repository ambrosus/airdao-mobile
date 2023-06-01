export enum Social {
  Twitter = 'twitter',
  Sms = 'sms',
  Other = 'Other'
}

export interface SharingOptions {
  title: string;
  message?: string;
}

export interface SharingOptionsWithMedia extends SharingOptions {
  uri: string;
}
