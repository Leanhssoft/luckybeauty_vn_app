import { Theme } from "@rneui/base";
import { useTheme } from "@rneui/themed";
import { StyleSheet, View } from "react-native";

export default function Invoices() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return <View style={styles.container}> page invoice</View>;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });
