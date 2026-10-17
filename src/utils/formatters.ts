export function formatDisplayDate(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) {
    return isoDate;
  }
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatYears(years: number): string {
  let y = Math.floor(years);
  let months = Math.round((years - y) * 12);
  if (months === 12) {
    months = 0;
    y += 1;
  }
  if (months === 0) {
    return `${y}y`;
  }
  if (y === 0) {
    return `${months}m`;
  }
  return `${y}y ${months}m`;
}
