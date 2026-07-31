const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const parseIsoDate = (value?: string | null): Date | undefined => {
  if (!value) return undefined;

  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return undefined;

  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

export const formatReleaseDate = (value?: string | null): string | undefined => {
  const date = parseIsoDate(value);
  if (!date) return undefined;

  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export const inTheatersLabel = (value?: string | null): string | undefined => {
  const formatted = formatReleaseDate(value);
  return formatted ? `In Theaters ${formatted}` : undefined;
};
