import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { palette } from '../../constants/colors';

export interface ScreenCurveProps {
  width: number;
  height?: number;
  color?: string;
  lightColor?: string;
}

export default function ScreenCurve({
  width,
  height = 24,
  color = '#61C3F2',
  lightColor = palette.blue,
}: ScreenCurveProps) {
  if (width <= 0) return null;

  const curve = `M0 ${height} Q ${width / 2} -${height * 0.6} ${width} ${height}`;
  const light = `${curve} L ${width} ${height} L 0 ${height} Z`;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id="screenLight" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={lightColor} stopOpacity={0.08} />
          <Stop offset="1" stopColor={lightColor} stopOpacity={0.01} />
        </LinearGradient>
      </Defs>
      <Path d={light} fill="url(#screenLight)" />
      <Path
        d={curve}
        stroke={color}
        strokeWidth={0.45}
        fill="none"
        opacity={1}
      />
    </Svg>
  );
}
