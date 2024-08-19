import _ from 'lodash';

export function mapper(array: number[][]): number[] {
  return _.map(array, (inner) => inner[1]);
}

/**
 * Function to downsample an array of data points to a specified number of target points.
 *
 * This function reduces the number of data points in the input array by selecting
 * a subset of points that are evenly spaced. It ensures that the returned array
 * contains no more than the specified number of target points.
 *
 * @template T - The type of elements in the input array.
 * @param array - The array of data points to be downsampled.
 * @param targetPoints - The target number of points to downsample to.
 * @returns - The downsampled array of data points, containing up to targetPoints elements.
 */
export function downsample<T>(array: T[], targetPoints: number) {
  if (array.length <= targetPoints) return array;

  const points = [];
  const step = Math.floor(array.length / targetPoints);

  for (let i = 0; i < array.length; i += step) {
    points.push(array[i]);
  }

  return points;
}
