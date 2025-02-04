export const rpcErrorHandler = (point: unknown, err: unknown) => {
  const error = typeof err === 'string' ? err : JSON.stringify(err);
  console.error(`${point} ERROR`, error);
};

export const rpcRejectHandler = (code: number, error: unknown) => {
  return {
    code,
    message: error instanceof Error ? error.message : 'User rejected request'
  };
};
