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
      style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
      onPress={onPressRdo}
    >
      <View style={[styles.radio]}>
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: isSelected ? theme.colors.primary : undefined,
          }}
        ></View>
      </View>

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
      borderWidth: 2,
      borderColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
  });
