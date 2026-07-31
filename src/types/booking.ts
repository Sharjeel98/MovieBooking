
export interface BookingDay {
  id: string;
  label: string;
}

export interface Showtime {
  id: string;
  time: string;
  hall: string;
  priceFrom: number;
  bonusFrom: number;
}

export type SeatType = 'regular' | 'vip';

export type SeatStatus = 'available' | 'unavailable' | 'selected';

export interface Seat {
  id: string;
  row: number;
  column: number;
  type: SeatType;
  available: boolean;
}
