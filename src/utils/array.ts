function mergeArrays<T>(compareKey: keyof T, ...arrays: T[][]) {
  const result: T[] = [];
  for (let i = 0; i < arrays.length; i++) {
    const curArray = arrays[i];
    result.push(
      ...curArray.filter((item) => result.indexOfItem(item, compareKey) === -1)
    );
  }
  return result;
}

export const ArrayUtils = { mergeArrays };
