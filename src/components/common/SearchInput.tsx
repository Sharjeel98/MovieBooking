import { Pressable, StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { palette } from '../../constants/colors';
import { fontFamily, fontSize } from '../../constants/typography';
import { colors, radius, spacing } from '../../theme';
import { dp } from '../../utils/responsive';
import { CloseIcon, SearchIcon } from '../icons';

export interface SearchInputProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
}

export default function SearchInput({
  value,
  onChangeText,
  onClear,
  ...rest
}: SearchInputProps) {
  return (
    <View style={styles.root}>
      <SearchIcon size={dp(20)} color={colors.textPrimary} />
      <TextInput
        {...rest}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        placeholder={rest.placeholder ?? 'TV shows, movies and more'}
        placeholderTextColor={colors.textSecondary}
        returnKeyType={rest.returnKeyType ?? 'search'}
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="never"
      />
      {!!value && (
        <Pressable
          onPress={() => (onClear ? onClear() : onChangeText(''))}
          hitSlop={spacing.sm}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <CloseIcon size={dp(20)} color={colors.textPrimary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    height: dp(48),
    borderRadius: radius.pill,
    backgroundColor: palette.cloud,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: dp(fontSize.md),
    color: colors.textPrimary,
    paddingVertical: 0,
  },
});
