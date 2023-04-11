interface Array<T> {
  /**
   *
   * @param item
   * @param key string keyof T
   */
  indexOfItem(item: T, key?: keyof T): number;

  /**
   *
   * @param item
   * @param key string keyof T
   * @param count number of items to delete default value: 1
   */
  removeItem(item: T, key?: keyof T, count?: number): void;
}
