import { IconType } from "@/enum/IconType";
import { useAppContext } from "@/store/react_context/AppProvider";
import CommonFunc from "@/utils/CommonFunc";
import Octicons from "@expo/vector-icons/Octicons";
import { Theme } from "@rneui/base";
import { Avatar, Icon, Text, useTheme } from "@rneui/themed";
import { useState } from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import ModalChangePassWord from "./modal_change_password";

export default function HeaderUserInfor() {
  const { theme } = useTheme();
  const styles = createStyle(theme);
  const { userLogin, logout } = useAppContext();
  // const { onClosePopover } = usePopoverContext();

  const [isShowModalChangePass, setIsShowModalChangePass] = useState(false);

  const onPressLogout = () => {
    logout();
  };

  const onCloseModalChangePassword = () => {
    setIsShowModalChangePass(false);
  };

  const onSaveOKModalChangePassword = async () => {
    setIsShowModalChangePass(false);
  };
  const showModalChangePassword = () => {
    // onClosePopover();
    setTimeout(() => setIsShowModalChangePass(true), 0);
  };
  return (
    <View style={styles.container}>
      <ModalChangePassWord
        isShow={isShowModalChangePass}
        onClose={onCloseModalChangePassword}
        onSave={onSaveOKModalChangePassword}
      />

      <View style={styles.box}>
        <View
          style={{
            paddingBottom: 8,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.grey5,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Avatar
              size={32}
              rounded
              containerStyle={{ backgroundColor: theme.colors.greyOutline }}
              // source={userLogin?.userAvatar ? { uri: userLogin?.userAvatar } : {}}
              title={
                CommonFunc.checkNull(userLogin?.userAvatar ?? "")
                  ? CommonFunc.getFirstLetter(userLogin?.userName)
                  : ""
              }
            />
            <Text style={{ marginLeft: 8 }}> {userLogin?.userName}</Text>
          </View>
        </View>

        {/* <TouchableOpacity
          style={styles.boxUserInfor}
          onPress={showModalAddUser}
        >
          <FontAwesome5 name="user" size={16} />
          <Text style={{ marginLeft: 8 }}>Quản lý tài khoản</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={[styles.boxUserInfor]}
          onPress={showModalChangePassword}
        >
          <Octicons name="key" size={16} />
          <Text style={{ marginLeft: 8 }}>Đổi mật khẩu</Text>
        </TouchableOpacity>

        <Pressable style={styles.boxUserInfor} onPress={onPressLogout}>
          <Icon name="logout" size={16} type={IconType.ANTDESIGN} />
          <Text style={{ marginLeft: 8 }}> Đăng xuất</Text>
        </Pressable>
      </View>
    </View>
  );
}

const createStyle = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: "auto",
      height: "auto",
    },
    box: {
      padding: 4,
      gap: 12,
    },
    boxUserInfor: {
      padding: 8,
      flexDirection: "row",
      alignItems: "center",
    },
    btnLogout: {
      flexDirection: "row",
      padding: 8,
      // borderRadius: 16,
      // borderWidth: 1,
      // borderColor: theme.colors.grey4,
      justifyContent: "center",
    },
  });
