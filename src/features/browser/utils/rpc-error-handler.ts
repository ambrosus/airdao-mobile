export const rpcErrorHandler = (point: unknown, err: unknown) => {
  const error = typeof err === 'string' ? err : JSON.stringify(err);
  console.error(`${point} ERROR`, error);
};
