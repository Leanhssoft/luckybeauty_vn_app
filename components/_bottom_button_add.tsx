import { IconType } from "@/enum/IconType";
import { Icon, useTheme } from "@rneui/themed";
import { FC } from "react";
import { TouchableOpacity, View } from "react-native";

const BottomButtonAdd: FC<{ onPress: () => void }> = ({ onPress }) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      style={{
        position: "absolute",
        bottom: 40,
        right: 20,
      }}
      onPress={onPress}
    >
      <View
        style={{
          width: 70,
          height: 70,
          borderRadius: 35,
          backgroundColor: theme.colors.primary,
          justifyContent: "center",
        }}
      >
        <Icon
          type={IconType.MATERIAL}
          name="add"
          color={theme.colors.white}
          size={50}
        ></Icon>
      </View>
    </TouchableOpacity>
  );
};

export default BottomButtonAdd;
