export enum Network {
  APPLE = 'apple',
  GOOGLE = 'google',
  FACEBOOK = 'facebook'
}

export type IDecodedPayload = {
  sub: string;
  email: string;
  exp: number;
  iat: number;
  iss: string;
  nonce: string;
  aud: string;
  auth_time: number;
  email_verified: boolean;
  azp: string;
};
