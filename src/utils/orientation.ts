import * as ScreenOrientation from 'expo-screen-orientation';

export const lockPortrait = () => {
  return ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(
    () => undefined,
  );
};

export const lockLandscape = () => {
  return ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch(
    () => undefined,
  );
};
