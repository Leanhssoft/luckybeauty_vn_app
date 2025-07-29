import { Theme } from "@rneui/base";
import { useTheme } from "@rneui/themed";
import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ICenterViewProps } from "../type/ICenterViewProps";

// style: cho phép override style từ ngoài nếu cần
export const ModalContainer: FC<ICenterViewProps> = ({
  children,
  style,
  ...rest
}) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return (
    <View
      style={[
        styles.container,
        style,
        { marginTop: insets.top, marginBottom: insets.bottom },
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      height: "100%",
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
      boxShadow: `0px 2px ${theme.colors.greyOutline}`,

      //  Ẩn (không hiển thị) bất kỳ phần tử con nào bị tràn ra ngoài góc bo tròn
      overflow: "hidden",
      backgroundColor: theme.colors.white,
    },
  });
