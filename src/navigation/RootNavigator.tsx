import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BookingScreen from '../screens/Booking/BookingScreen';
import SeatSelectionScreen from '../screens/Booking/SeatSelectionScreen';
import MovieDetailScreen from '../screens/Details/MovieDetailScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import { placeholder } from '../screens/Placeholder/PlaceholderScreen';
import SearchResultsScreen from '../screens/Search/SearchResultsScreen';
import SearchScreen from '../screens/Search/SearchScreen';
import TrailerScreen from '../screens/Trailer/TrailerScreen';
import { colors } from '../theme';
import BottomTabBar from './BottomTabBar';
import { Routes, TabRoutes, WatchRoutes } from './routes';
import type {
  MainTabParamList,
  RootStackParamList,
  WatchStackParamList,
} from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();
const WatchStack = createNativeStackNavigator<WatchStackParamList>();

function WatchNavigator() {
  return (
    <WatchStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <WatchStack.Screen name={WatchRoutes.Home} component={HomeScreen} />
      <WatchStack.Screen name={WatchRoutes.Search} component={SearchScreen} />
      <WatchStack.Screen
        name={WatchRoutes.SearchResults}
        component={SearchResultsScreen}
      />
    </WatchStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
      }}
      initialRouteName={TabRoutes.Watch}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      <Tabs.Screen
        name={TabRoutes.Dashboard}
        component={placeholder('Dashboard')}
      />
      <Tabs.Screen name={TabRoutes.Watch} component={WatchNavigator} />
      <Tabs.Screen
        name={TabRoutes.MediaLibrary}
        component={placeholder('Media Library')}
      />
      <Tabs.Screen name={TabRoutes.More} component={placeholder('More')} />
    </Tabs.Navigator>
  );
}

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.background },
};

export default function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          orientation: 'portrait_up',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <RootStack.Screen name={Routes.MainTabs} component={MainTabs} />
        <RootStack.Screen
          name={Routes.MovieDetail}
          component={MovieDetailScreen}
        />
        <RootStack.Screen name={Routes.Booking} component={BookingScreen} />
        <RootStack.Screen
          name={Routes.SeatSelection}
          component={SeatSelectionScreen}
        />
        <RootStack.Screen
          name={Routes.Trailer}
          component={TrailerScreen}
          options={{
            presentation: 'fullScreenModal',
            orientation: 'landscape',
            contentStyle: { backgroundColor: colors.black },
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
