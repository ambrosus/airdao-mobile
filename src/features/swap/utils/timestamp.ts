export function getTimestampDeadline(deadline: string) {
  return Math.floor(Date.now() / 1000) + 60 * Number(deadline);
}
