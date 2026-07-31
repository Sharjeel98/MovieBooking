import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import SeatIcon from '../../../assets/icons/seatIcon.svg';
import { palette } from '../../constants/colors';
import { SEAT_BLOCKS, buildSeatMap, splitSeatRow } from '../../mocks/seats';
import { dp } from '../../utils/responsive';
import ScreenCurve from './ScreenCurve';

const noise = (seed: number, row: number, column: number) => {
  const value =
    Math.sin(seed * 12.9898 + row * 78.233 + column * 37.719) * 43758.5453;
  return value - Math.floor(value);
};

const seatColor = (seed: number, row: number, column: number) => {
  const value = noise(seed, row, column);
  if (value < 0.34) return palette.mist;
  if (value < 0.88) return palette.blue;
  if (value < 0.94) return palette.teal;
  if (value < 0.97) return palette.pink;
  return palette.purple;
};

export interface SeatMapPreviewProps {
  seed?: number;
}

function SeatMapPreview({ seed = 1 }: SeatMapPreviewProps) {
  const rows = buildSeatMap(seed);

  return (
    <View style={styles.root} pointerEvents="none">
      <View style={styles.screenBand}>
        <ScreenCurve width={SCREEN_WIDTH} height={dp(18)} />
      </View>
      <View style={styles.seats}>
        {rows.map((seats, row) => (
          <View key={row} style={styles.row}>
            {splitSeatRow(seats).map((block, blockIndex) => (
              <View
                key={blockIndex}
                style={[
                  styles.seatBlock,
                  blockIndex === 0 && styles.leftBlock,
                  blockIndex === SEAT_BLOCKS.length - 1 && styles.rightBlock,
                  {
                    width:
                      SEAT_BLOCKS[blockIndex] * SEAT +
                      (SEAT_BLOCKS[blockIndex] - 1) * GAP,
                    marginRight:
                      blockIndex === SEAT_BLOCKS.length - 1 ? 0 : AISLE,
                  },
                ]}
              >
                {block.map((seat, seatIndex) => (
                  <View
                    key={seat.id}
                    style={{
                      marginRight: seatIndex === block.length - 1 ? 0 : GAP,
                    }}
                  >
                    <SeatIcon
                      width={SEAT}
                      height={SEAT}
                      color={seatColor(seed, row, seat.column)}
                    />
                  </View>
                ))}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

export default memo(SeatMapPreview);

const SEAT = dp(5);
const GAP = dp(3);
const AISLE = dp(14);
const PREVIEW_WIDTH =
  SEAT_BLOCKS.reduce(
    (width, block) => width + block * SEAT + (block - 1) * GAP,
    0,
  ) +
  AISLE * (SEAT_BLOCKS.length - 1);
const SCREEN_WIDTH = PREVIEW_WIDTH * 1.15;

const styles = StyleSheet.create({
  root: { width: SCREEN_WIDTH, alignItems: 'center' },
  screenBand: {
    width: SCREEN_WIDTH,
    height: dp(18),
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: dp(5),
  },
  seats: { alignItems: 'center', gap: GAP },
  row: { flexDirection: 'row' },
  seatBlock: { flexDirection: 'row' },
  leftBlock: { justifyContent: 'flex-end' },
  rightBlock: { justifyContent: 'flex-start' },
});
