export function sortListByKey<T>(
  arr: T[],
  key: keyof T,
  order?: 'asc' | 'desc'
) {
  return arr.sort((a, b) =>
    //@ts-ignore
    order === 'asc' ? a[key] - b[key] : b[key] - a[key]
  );
}
