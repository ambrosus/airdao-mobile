export enum Social {
  Twitter = 'twitter',
  Image = 'Image',
  Sms = 'sms'
}

export interface SharingOptions {
  title: string;
  message?: string;
}

export interface SharingOptionsWithMedia extends SharingOptions {
  uri: string;
}
