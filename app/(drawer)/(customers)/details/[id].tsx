import { Theme } from "@rneui/base";
import { Text, useTheme } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CustomerDetails() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text>CustomerDetails</Text>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });
