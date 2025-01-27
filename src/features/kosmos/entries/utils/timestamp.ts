import moment from 'moment';

const LOCK_PERIOD_FORMAT = 'DD/MM/YYYY';

export function timestampToDate(timestamp: number) {
  return moment(timestamp * 1000);
}

export function timestampToFormattedDate(
  timestamp: number,
  format = LOCK_PERIOD_FORMAT
) {
  return timestampToDate(timestamp).format(format);
}

export const replaceTimestamps = (array1: any[], array2: any[]): any[] => {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < array1.length && j < array2.length) {
    if (
      Math.abs(array1[i].timestamp - array2[j].timestamp) <=
      Math.abs(array1[i].timestamp - (array2[j + 1]?.timestamp || Infinity))
    ) {
      result.push({ timestamp: array2[j].timestamp, price: array1[i].price });
      i++;
    } else {
      j++;
    }
  }
  return result;
};

export function getTimeRemaining(timestamp: number): string {
  const now: number = new Date().getTime();

  const difference: number = timestamp * 1000 - now;

  if (difference < 0) {
    return '0d 0h 0m';
  }

  const days: number = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours: number = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes: number = Math.floor(
    (difference % (1000 * 60 * 60)) / (1000 * 60)
  );

  return `${days}d ${hours}h ${minutes}m`;
}

export function _timestampToDate(
  timestamp: number,
  withoutTime?: boolean
): string {
  const date = new Date(timestamp * 1000);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  let formattedDate = `${day}/${month}/${year}`;

  if (!withoutTime) formattedDate += ` ${hours}:${minutes}`;
  return formattedDate;
}
