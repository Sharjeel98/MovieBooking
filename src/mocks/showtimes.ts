import { BookingDay, Showtime } from '../types/booking';


export const SEAT_PRICES = {
  regular: 50,
  vip: 150,
} as const;

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const pad = (value: number) => String(value).padStart(2, '0');

export const buildBookingDays = (count = 7, from = new Date()): BookingDay[] =>
  Array.from({ length: count }, (_, offset) => {
    const date = new Date(
      from.getFullYear(),
      from.getMonth(),
      from.getDate() + offset,
    );

    return {
      id: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
      label: `${date.getDate()} ${MONTHS[date.getMonth()]}`,
    };
  });

export const SHOWTIMES: Showtime[] = [
  {
    id: 'showtime-1',
    time: '12:30',
    hall: 'Cinetech + Hall 1',
    priceFrom: 50,
    bonusFrom: 2500,
  },
  {
    id: 'showtime-2',
    time: '13:30',
    hall: 'Cinetech + Hall 2',
    priceFrom: 75,
    bonusFrom: 3000,
  },
  {
    id: 'showtime-3',
    time: '15:00',
    hall: 'Cinetech + Hall 3',
    priceFrom: 60,
    bonusFrom: 2700,
  },
  {
    id: 'showtime-4',
    time: '18:45',
    hall: 'Cinetech + Hall 1',
    priceFrom: 90,
    bonusFrom: 3500,
  },
];
