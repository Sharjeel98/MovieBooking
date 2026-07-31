import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppText from '../../components/common/AppText';
import { colors } from '../../theme';

export interface PlaceholderScreenProps {
  name: string;
}

export default function PlaceholderScreen({ name }: PlaceholderScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <AppText variant="h2">{name}</AppText>
    </View>
  );
}

export const placeholder = (name: string) => () =>
  <PlaceholderScreen name={name} />;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
