function indexOfItem<T>(this: Array<T>, item: T, key?: keyof T) {
  if (key) {
    return this.findIndex((i) => i[key] === item[key]);
  }
  return this.indexOf(item);
}

function removeItem<T>(this: Array<T>, item: T, key?: keyof T, count = 1) {
  const idx = this.indexOfItem(item, key);
  if (idx > -1) this.splice(idx, count);
}

Object.defineProperty(Array.prototype, 'indexOfItem', {
  value: indexOfItem
});

Object.defineProperty(Array.prototype, 'removeItem', {
  value: removeItem
});

export {};
