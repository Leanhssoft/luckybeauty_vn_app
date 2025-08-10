import { IconType } from "@/enum/IconType";
import { Icon, Text, useTheme } from "@rneui/themed";
import { FC } from "react";
import { StyleSheet, TouchableOpacity, View, ViewProps } from "react-native";

type TitleModalProps = ViewProps & {
  title: string;
  onClose: () => void;
};

export const TitleModal: FC<TitleModalProps> = ({
  title,
  onClose,
  style,
  ...rest
}) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.primary },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onClose}
        style={{
          position: "absolute",
          right: 10,
          top: 13,
          zIndex: 1,
        }}
      >
        <Icon
          type={IconType.IONICON}
          name="close"
          color={theme.colors.white}
          size={24}
        />
      </TouchableOpacity>

      <Text
        style={{
          color: theme.colors.white,
          fontWeight: "bold",
          fontSize: 16,
        }}
      >
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    height: 50,
  },
});
