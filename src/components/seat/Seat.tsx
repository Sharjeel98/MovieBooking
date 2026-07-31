import { memo } from 'react';
import { Pressable } from 'react-native';

import SeatIcon from '../../../assets/icons/seatIcon.svg';
import { colors } from '../../theme';
import { Seat as SeatModel } from '../../types/booking';

export interface SeatProps {
  seat: SeatModel;
  selected?: boolean;
  size: number;
  onPress?: (seat: SeatModel) => void;
}

export const seatColor = (seat: SeatModel, selected: boolean) => {
  if (selected) return colors.seatSelected;
  if (!seat.available) return colors.seatUnavailable;
  return seat.type === 'vip' ? colors.seatVip : colors.seatRegular;
};

function Seat({ seat, selected = false, size, onPress }: SeatProps) {
  const disabled = !seat.available;

  return (
    <Pressable
      onPress={() => onPress?.(seat)}
      disabled={disabled}
      hitSlop={2}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={`Row ${seat.row}, seat ${seat.column}, ${
        disabled ? 'unavailable' : seat.type
      }`}
      style={({ pressed }) => (pressed && !disabled ? { opacity: 0.6 } : null)}
    >
      <SeatIcon width={size} height={size} color={seatColor(seat, selected)} />
    </Pressable>
  );
}

export default memo(Seat);
