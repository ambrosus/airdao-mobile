export const ERRORS = {
  idToken: 'Unable to parse idToken',
  canceled: 'Sign in was cancelled by user',
  loading: 'operation (eg. sign in) already in progress',
  playServices: 'Android only, play services not available or outdated',
  failed: 'Failed to sign in'
};

export function $error(message: keyof typeof ERRORS) {
  throw new Error(ERRORS[message]);
}
