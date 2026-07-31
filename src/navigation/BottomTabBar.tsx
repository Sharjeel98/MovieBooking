import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppText from '../components/common/AppText';
import { tabIcons } from '../components/icons/tabIcons';
import { fontFamily } from '../constants/typography';
import { colors, radius, spacing } from '../theme';
import { dp } from '../utils/responsive';
import { TabRoutes } from './routes';

const iconSizes: Record<string, { width: number; height: number }> = {
  [TabRoutes.Dashboard]: { width: dp(15), height: dp(15) },
  [TabRoutes.Watch]: { width: dp(19), height: dp(19) },
  [TabRoutes.MediaLibrary]: { width: dp(18), height: dp(18) },
  [TabRoutes.More]: { width: dp(18), height: dp(18) },
};

const labels: Record<string, string> = {
  [TabRoutes.Dashboard]: 'Dashboard',
  [TabRoutes.Watch]: 'Watch',
  [TabRoutes.MediaLibrary]: 'Media Library',
  [TabRoutes.More]: 'More',
};

export default function BottomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingBottom: insets?.bottom ? (insets.bottom + spacing.sm) : spacing.md }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const Icon = tabIcons[route.name];
        const iconSize = iconSizes[route.name];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={labels[route.name]}
            style={styles.tab}
          >
            <View style={styles.iconSlot}>
              {!!Icon && (
                <Icon
                  width={iconSize.width}
                  height={iconSize.height}
                  color={focused ? colors.tabActive : colors.tabInactive}
                />
              )}
            </View>
            <AppText
              variant="tab"
              numberOfLines={1}
              color={focused ? colors.tabActive : colors.tabInactive}
              style={[styles.label, focused && styles.selectedLabel]}
            >
              {labels[route.name]}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    backgroundColor: colors.tabBar,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: spacing.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 16,
    zIndex: 10,
  },
  tab: { flex: 1, alignItems: 'center' },
  iconSlot: {
    height: dp(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { marginTop: spacing.xxs },
  selectedLabel: { fontFamily: fontFamily.bold },
});
