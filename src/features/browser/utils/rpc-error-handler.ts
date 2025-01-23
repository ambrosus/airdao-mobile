/* eslint-disable no-console */
// tslint:disable:no-console

export const rpcErrorHandler = (point: unknown, err: unknown) => {
  const error = typeof err === 'string' ? err : JSON.stringify(err);
  console.log(`${point} ERROR`, error);
};
