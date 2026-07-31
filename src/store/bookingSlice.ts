import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SEAT_PRICES } from '../mocks/showtimes';
import { Seat } from '../types/booking';
import type { RootState } from './index';

interface BookingState {
  dayId?: string;
  showtimeId?: string;
  seats: Record<string, Seat>;
}

const initialState: BookingState = { seats: {} };

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    selectDay(state, action: PayloadAction<string>) {
      if (state.dayId !== action.payload) {
        state.showtimeId = undefined;
        state.seats = {};
      }
      state.dayId = action.payload;
    },
    selectShowtime(state, action: PayloadAction<string>) {
      if (state.showtimeId !== action.payload) state.seats = {};
      state.showtimeId = action.payload;
    },
    toggleSeat(state, action: PayloadAction<Seat>) {
      const seat = action.payload;
      if (state.seats[seat.id]) delete state.seats[seat.id];
      else state.seats[seat.id] = seat;
    },
    clearSeats(state) {
      state.seats = {};
    },
    resetBooking: () => initialState,
  },
});

export const {
  selectDay,
  selectShowtime,
  toggleSeat,
  clearSeats,
  resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;


export const selectBooking = (state: RootState) => state.booking;

const selectSeatMap = (state: RootState) => state.booking.seats;

export const selectSelectedSeats = createSelector([selectSeatMap], (seats) =>
  Object.values(seats),
);

export const selectTotalPrice = createSelector([selectSelectedSeats], (seats) =>
  seats.reduce((total, seat) => total + SEAT_PRICES[seat.type], 0),
);
