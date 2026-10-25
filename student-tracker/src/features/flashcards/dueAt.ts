const pad = (n: number) => String(n).padStart(2, '0');

/** Date -> 'YYYY-MM-DDTHH:mm' in local time. These strings sort in time order. */
export const toDueAt = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

export const parseDueAt = (value: string) => {
  const [date, time] = value.split('T');
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = (time ?? '00:00').split(':').map(Number);
  return new Date(y, m - 1, d, hh, mm);
};

/** 'YYYY-MM-DD' for the given moment, in local time. */
export const dayKey = (d: Date) => toDueAt(d).slice(0, 10);