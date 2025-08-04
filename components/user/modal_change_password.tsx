import { IconType } from "@/enum/IconType";
import { useAppContext } from "@/store/react_context/AppProvider";
import { PropModal } from "@/type/PropModal";
import { Theme } from "@rneui/base";
import { Button, Icon, Text, useTheme } from "@rneui/themed";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackDropView } from "../back_drop_view";
import { TextFieldCustom } from "../text_filed_custom";

const ModalChangePassWord = ({
  isShow,
  onClose,
  onSave,
}: PropModal<string>) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { userLogin } = useAppContext();
  const insets = useSafeAreaInsets();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassWord, setNewPassword] = useState("");
  const [newPassWordRepeat, setNewPasswordRepeat] = useState("");

  useEffect(() => {
    if (isShow) {
    }
  }, [userLogin?.id]);

  const agree = async () => {};

  return (
    <Modal visible={isShow} transparent={true} animationType="slide">
      <BackDropView
        style={{
          justifyContent: "flex-start",
          marginTop: insets.top,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
      >
        <View
          style={{
            width: "100%",
            paddingVertical: 16,
            paddingHorizontal: 24, // nếu cần
            borderRadius: 16,
            overflow: "hidden",
            backgroundColor: theme.colors.white,
          }}
        >
          <View style={{ position: "relative" }}>
            <Text
              style={{ textAlign: "center", fontSize: 16, fontWeight: 600 }}
            >
              Đổi mật khẩu
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={{
                position: "absolute",
                right: 0,
                top: -10,
                zIndex: 1,
              }}
            >
              <Icon
                type={IconType.IONICON}
                name="close"
                color={"red"}
                size={30}
              />
            </TouchableOpacity>
          </View>

          <View style={{ gap: 12, marginTop: 24 }}>
            <View style={{ gap: 8 }}>
              <Text>Mật khẩu cũ</Text>
              <TextFieldCustom value={oldPassword} variant="outlined" />
            </View>
            <View style={{ gap: 12 }}>
              <Text>Mật khẩu mới</Text>
              <TextFieldCustom value={newPassWord} variant="outlined" />
            </View>
            <View style={{ gap: 12 }}>
              <Text>Nhập lại mật khẩu mới</Text>
              <TextFieldCustom value={newPassWordRepeat} variant="outlined" />
            </View>
            <Button
              size="md"
              title={"Lưu thay đổi"}
              //type="outline"
              containerStyle={{
                borderRadius: 16,
                borderColor: theme.colors.primary,
              }}
              titleStyle={{ fontSize: 14 }}
              onPress={agree}
            />
          </View>
        </View>
      </BackDropView>
    </Modal>
  );
};

export default ModalChangePassWord;
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    boxButton: {
      //   right: 16,
      // //   position: "absolute",
      // //   width: "100%",
      //   backgroundColor: theme.colors.white,
      //   bottom: 0,
    },
  });
