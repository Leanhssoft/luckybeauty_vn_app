import { Dialog, Text, useTheme } from "@rneui/themed";
import { View } from "react-native";
import { IPropsSimpleDialog } from "../type/IPropsSimpleDialog";

export type IPropsConfirmOKCancel = IPropsSimpleDialog & {
  onClose: () => void;
  onAgree: () => void;
};

export const ConfirmOKCancel = ({
  isShow,
  title = "Thông báo",
  mes = "",
  onClose,
  onAgree,
}: IPropsConfirmOKCancel) => {
  const { theme } = useTheme();
  return (
    <Dialog isVisible={isShow} onBackdropPress={onClose}>
      <Dialog.Title title={title} />
      <Text>{mes}</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: 8,
          paddingTop: 16,
        }}
      >
        <Dialog.Button
          title={"Đóng"}
          onPress={onClose}
          buttonStyle={{
            backgroundColor: theme.colors.primary,
            borderRadius: 4,
          }}
          titleStyle={{ color: theme.colors.white }}
        />
        <Dialog.Button
          title={"Đồng ý"}
          buttonStyle={{ backgroundColor: theme.colors.error, borderRadius: 4 }}
          titleStyle={{ color: theme.colors.white }}
          onPress={onAgree}
        />
      </View>
    </Dialog>
  );
};
