import { Theme } from "@rneui/base";
import { Text, useTheme } from "@rneui/themed";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type RadioProps = {
  label: string;
  isSelected: boolean;
  onPressRdo: () => void;
};

export default function Radio({ label, isSelected, onPressRdo }: RadioProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return (
    <TouchableOpacity
      style={{ flexDirection: "row", gap: 8 }}
      onPress={onPressRdo}
    >
      <View
        style={[
          styles.radio,
          { backgroundColor: isSelected ? theme.colors.primary : undefined },
        ]}
      ></View>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    radio: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.grey4,
    },
  });
