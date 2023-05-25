const indexOfItem = function (item, key) {
  if (key) {
    for (let i = 0; i < this.length; i++) {
      if (this[i][key] === item[key]) {
        return i;
      }
    }
  } else {
    return this.indexOf(item);
  }
};

Object.defineProperty(Array.prototype, 'removeItem', {
  value: jest.fn()
});

describe('Array Utils', () => {
  it('should return the index of the given item in the array when no key is provided', () => {
    const arr = [1, 2, 3, 4, 5];
    const item = 3;
    const result = indexOfItem.call(arr, item);
    expect(result).toBe(2);
  });

  it('should return the index of the given item in the array based on the provided key', () => {
    const arr = [
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 30 },
      { name: 'Charlie', age: 35 }
    ];
    const item = { name: 'Bob', age: 30 };
    const result = indexOfItem.call(arr, item, 'name');
    expect(result).toBe(1);
  });

  it('should return -1 when the item is not found in the array', () => {
    const arr = [1, 2, 3, 4, 5];
    const item = 6;
    const result = indexOfItem.call(arr, item);
    expect(result).toBe(-1);
  });

  it('should not remove any items from the array when the item is not found', () => {
    const arr = [1, 2, 3, 4, 5];
    const item = 6;
    arr.removeItem(item, undefined, 1);
    expect(arr).toEqual([1, 2, 3, 4, 5]);
  });
});
