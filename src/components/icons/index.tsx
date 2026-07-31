import type { FC } from 'react';
import type { SvgProps } from 'react-native-svg';

import BackSvg from '../../../assets/icons/back.svg';
import CloseSvg from '../../../assets/icons/close.svg';
import MoreDotsSvg from '../../../assets/icons/moreDots.svg';
import PlaySvg from '../../../assets/icons/play.svg';
import SearchSvg from '../../../assets/icons/search.svg';
import { colors } from '../../theme';
import { dp } from '../../utils/responsive';

export interface IconProps {
  size?: number;
  color?: string;
}

const defaults = (props: IconProps) => ({
  size: props.size ?? dp(24),
  color: props.color ?? colors.textPrimary,
});

const renderIcon = (Icon: FC<SvgProps>, props: IconProps) => {
  const { size, color } = defaults(props);
  return <Icon width={size} height={size} color={color} />;
};

export function SearchIcon(props: IconProps) {
  return renderIcon(SearchSvg, props);
}

export function CloseIcon(props: IconProps) {
  return renderIcon(CloseSvg, props);
}

export function BackIcon(props: IconProps) {
  return renderIcon(BackSvg, props);
}

export function PlayIcon(props: IconProps) {
  return renderIcon(PlaySvg, props);
}

export function MoreDotsIcon(props: IconProps) {
  return renderIcon(MoreDotsSvg, props);
}
