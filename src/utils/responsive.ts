import { Dimensions, PixelRatio } from 'react-native';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = 768;

export const dp = (size: number): number => {
  const widthScale = windowWidth / DESIGN_WIDTH;
  const heightScale = windowHeight / DESIGN_HEIGHT;
  const scaleRatio = Math.min(widthScale, heightScale);
  return PixelRatio.roundToNearestPixel(size * scaleRatio);
};

export const screen = { width: windowWidth, height: windowHeight };
