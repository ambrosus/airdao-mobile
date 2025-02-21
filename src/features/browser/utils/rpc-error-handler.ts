export const rpcErrorHandler = (point: string | any, err: unknown) => {
  const error = typeof err === 'string' ? err : JSON.stringify(err, null, 2);
  console.error(`${point} ERROR`, error);
};

export const rpcRejectHandler = (code: number, error: unknown) => {
  console.log('CATCH ERROR', error);
  return {
    code,
    message: error instanceof Error ? error.message : 'User rejected request'
  };
};
