import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export function toDayKey(isoLike: string | Date) {
  return dayjs(isoLike).utc().format('YYYY-MM-DD')
}

export function dayRangeUtc(isoLike: string | Date) {
  const start = dayjs(isoLike).utc().startOf('day')
  const end = start.add(1, 'day')
  return {
    start: start.toDate(),
    end: end.toDate(),
    dayKey: start.format('YYYY-MM-DD'),
  }
}

// ✅ Generate 10 consecutive days
export function generateTenDays(from: string) {
  // Force "YYYY-MM-DD"
  const start = dayjs(from).startOf('day')
  return Array.from({ length: 10 }, (_, i) => {
    const d = start.add(i, 'day')
    return {
      date: d.toDate(),            // keep a Date for convenience
      dayKey: d.format('YYYY-MM-DD'), // canonical field for queries
    }
  })
}
