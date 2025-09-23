// src/jamats/utils/date.util.ts
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export function toDayKey(isoLike: string | Date) {
  return dayjs(isoLike).utc().format('YYYY-MM-DD');
}

export function dayRangeUtc(isoLike: string | Date) {
  const start = dayjs(isoLike).utc().startOf('day');
  const end = start.add(1, 'day');
  return { start: start.toDate(), end: end.toDate(), dayKey: start.format('YYYY-MM-DD') };
}
