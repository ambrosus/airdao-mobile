export async function wrapCallbackWithErrorHandler<T>(
  cb: Promise<T>
): Promise<T> {
  try {
    return await cb;
  } catch (error) {
    throw error;
  }
}
