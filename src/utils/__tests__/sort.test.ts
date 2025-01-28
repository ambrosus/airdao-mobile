import { sortListByKey } from '@utils/sort';

describe('sortListByKey', () => {
  it('should sort an array of objects in ascending order by the specified key', () => {
    const input = [{ id: 2 }, { id: 1 }, { id: 3 }];
    const expected = [{ id: 1 }, { id: 2 }, { id: 3 }];
    expect(sortListByKey(input, 'id', 'asc')).toEqual(expected);
  });

  it('should sort an array of objects in descending order by the specified key', () => {
    const input = [{ id: 2 }, { id: 1 }, { id: 3 }];
    const expected = [{ id: 3 }, { id: 2 }, { id: 1 }];
    expect(sortListByKey(input, 'id', 'desc')).toEqual(expected);
  });

  it('should handle an empty array', () => {
    const input: any[] = [];
    const expected: any[] = [];
    expect(sortListByKey(input, 'id', 'asc')).toEqual(expected);
  });

  it('should handle an array with a single element', () => {
    const input = [{ id: 1 }];
    const expected = [{ id: 1 }];
    expect(sortListByKey(input, 'id', 'asc')).toEqual(expected);
  });
});
