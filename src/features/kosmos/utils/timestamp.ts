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
