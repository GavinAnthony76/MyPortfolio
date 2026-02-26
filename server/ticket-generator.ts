const MONTHS = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
];

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function randomSuffix(len: number): string {
  let result = '';
  for (let i = 0; i < len; i++) {
    result += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return result;
}

export function generateTicketNumber(date: Date = new Date()): string {
  const month = MONTHS[date.getMonth()];
  const year = String(date.getFullYear());
  const day = String(date.getDate()).padStart(2, '0');

  const base =
    month[0] +
    year[0] +
    month[1] +
    year[1] +
    month[2] +
    year[2] +
    year[3] +
    day;

  return base + randomSuffix(3);
}
