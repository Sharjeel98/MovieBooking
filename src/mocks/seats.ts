import { Seat } from '../types/booking';

const ROWS = 10;
export const SEAT_BLOCKS = [5, 14, 5] as const;
const VIP_ROWS = new Set([ROWS]);

export const SEAT_ROWS = ROWS;
export const SEATS_PER_ROW = SEAT_BLOCKS.reduce((sum, block) => sum + block, 0);

export const seatBlocksForRow = (row: number): number[] => {
  if (row === 1) return [2, SEAT_BLOCKS[1], 2];
  if (row <= 4) return [4, SEAT_BLOCKS[1], 4];
  return [...SEAT_BLOCKS];
};

export const splitSeatRow = (seats: Seat[]): Seat[][] => {
  let offset = 0;

  return seatBlocksForRow(seats[0]?.row ?? 1).map((blockSize) => {
    const block = seats.slice(offset, offset + blockSize);
    offset += blockSize;
    return block;
  });
};

const noise = (seed: number, row: number, column: number) => {
  const value =
    Math.sin(seed * 374.761 + row * 127.1 + column * 311.7) * 43758.5453;
  return value - Math.floor(value);
};

export const buildSeatMap = (seed = 1): Seat[][] =>
  Array.from({ length: ROWS }, (_, rowIndex) => {
    const row = rowIndex + 1;
    let column = 0;

    return seatBlocksForRow(row).flatMap((blockSize) =>
      Array.from({ length: blockSize }, () => {
        column += 1;
        return {
          id: `${row}-${column}`,
          row,
          column,
          type: VIP_ROWS.has(row) ? ('vip' as const) : ('regular' as const),
          available: noise(seed, row, column) > 0.34,
        };
      }),
    );
  });

export const AISLE_AFTER = SEAT_BLOCKS.reduce<number[]>((positions, block, index) => {
  if (index === SEAT_BLOCKS.length - 1) return positions;
  const previous = positions[positions.length - 1] ?? 0;
  positions.push(previous + block);
  return positions;
}, []);
