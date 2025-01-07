export function extractHttpsPath(path: string | undefined) {
  if (!path) return '';
  return path.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

export function extractTrailingSlash(path: string | undefined) {
  if (!path) return '';
  return path.replace(/\/$/, '');
}
