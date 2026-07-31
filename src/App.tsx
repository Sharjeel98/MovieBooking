import { useFonts } from 'expo-font';
import { NavigationBar } from 'expo-navigation-bar';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { fontAssets } from './constants/typography';
import RootNavigator from './navigation/RootNavigator';
import { store } from './store';
import { lockPortrait } from './utils/orientation';

void SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 300, fade: true });

export default function App() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  useEffect(() => {
    lockPortrait();
    StatusBar.setStyle("dark")
    StatusBar.setHidden(false)
    NavigationBar.setHidden(false)
    NavigationBar.setStyle("light")
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </Provider>
  );
}
