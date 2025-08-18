import { Theme } from "@rneui/base";
import { useTheme } from "@rneui/themed";
import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { ICenterViewProps } from "../type/ICenterViewProps";

// style: cho phép override style từ ngoài nếu cần
export const BackDropView: FC<ICenterViewProps> = ({
  children,
  style,
  ...rest
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return (
    <View style={[styles.backdrop, style]} {...rest}>
      {children}
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
  });
