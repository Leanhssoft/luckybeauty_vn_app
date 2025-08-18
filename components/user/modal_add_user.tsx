import { IconType } from "@/enum/IconType";
import { IUserBasic } from "@/services/user/IUserBasic";
import { IUserDto } from "@/services/user/IUserDto";
import UserService from "@/services/user/UserService";
import { useAppContext } from "@/store/react_context/AppProvider";
import { PropModal } from "@/type/PropModal";
import CommonFunc from "@/utils/CommonFunc";
import { Theme } from "@rneui/base";
import { Avatar, Button, Icon, Text, useTheme } from "@rneui/themed";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackDropView } from "../back_drop_view";
import { TextFieldCustom } from "../text_filed_custom";

const ModalAddUser = ({ isShow, onClose, onSave }: PropModal<IUserDto>) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { userLogin } = useAppContext();

  const insets = useSafeAreaInsets();

  const [userInfor, setUserInfor] = useState<IUserBasic | null>(null);

  const GetInforUser_byId = async (userId: number) => {
    console.log("userLogin", userLogin);
    const data = await UserService.getUser_byId(userId);
    console.log("userInfor ", data);
    setUserInfor({
      id: data?.id ?? 0,
      userName: data?.userName ?? "",
      userAvatar: data?.userAvatar ?? "",
      emailAddress: data?.emailAddress ?? "",
    });
  };

  useEffect(() => {
    if (isShow) {
      GetInforUser_byId(userLogin?.id ?? 0);
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
            <Text style={{ textAlign: "center", fontSize: 16 }}>
              Thông tin tài khoản
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                zIndex: 1,
              }}
            >
              <Icon
                type={IconType.IONICON}
                name="close"
                color={"red"}
                size={24}
              />
            </TouchableOpacity>
          </View>

          <View style={{ gap: 12, marginTop: 24 }}>
            <Pressable style={{ alignItems: "center" }}>
              <Avatar
                size={100}
                rounded
                containerStyle={{ backgroundColor: theme.colors.greyOutline }}
                // source={userLogin?.userAvatar ? { uri: userLogin?.userAvatar } : {}}
                title={
                  CommonFunc.checkNull(userInfor?.userAvatar ?? "")
                    ? CommonFunc.getFirstLetter(userInfor?.userName)
                    : ""
                }
              />
            </Pressable>
            <View style={{ gap: 8 }}>
              <Text>Tên đăng nhập</Text>
              <TextFieldCustom value={userInfor?.userName} variant="outlined" />
            </View>
            <View style={{ gap: 12 }}>
              <Text>Email</Text>
              <TextFieldCustom
                value={userInfor?.emailAddress}
                variant="outlined"
              />
            </View>
            <Button
              size="md"
              title={"Cập nhật"}
              //   type="outline"
              containerStyle={{
                borderRadius: 16,
                borderColor: theme.colors.primary,
              }}
              onPress={agree}
            />
          </View>
        </View>
      </BackDropView>
    </Modal>
  );
};

export default ModalAddUser;
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
