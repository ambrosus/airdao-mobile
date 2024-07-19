import moment from 'moment';

const LOCK_PERIOD_FORMAT = 'DD/MM/YYYY';

export function timestampToDate(timestamp: number) {
  return moment(timestamp * 1000);
}

export function timestampToFormatedDate(
  timestamp: number,
  format = LOCK_PERIOD_FORMAT
) {
  return timestampToDate(timestamp).format(format);
}

export function replaceTimestamps<
  T extends { timestamp: number; price: number }
>(array1: T[], array2: T[]): { timestamp: number; price: number }[] {
  const result: { timestamp: number; price: number }[] = [];
  let i = 0;
  let j = 0;

  while (i < array1.length && j < array2.length) {
    const diff1 = Math.abs(array1[i].timestamp - array2[j].timestamp);
    const diff2 =
      j + 1 < array2.length
        ? Math.abs(array1[i].timestamp - array2[j + 1].timestamp)
        : Infinity;

    if (diff1 <= diff2) {
      result.push({ timestamp: array2[j].timestamp, price: array1[i].price });
      i++;
    } else {
      j++;
    }
  }

  return result;
}
