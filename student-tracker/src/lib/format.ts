export function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`;
}

export function formatPeso(amount: number): string {
  const whole = String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `₱${whole}`;
}

export function formatCountdown(minutes: number): string {
  if (minutes < 60) return `in ${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `in ${h} h` : `in ${h} h ${m} min`;
}