import { IconType } from "@/enum/IconType";
import { useAppContext } from "@/store/react_context/AppProvider";
import CommonFunc from "@/utils/CommonFunc";
import { Theme } from "@rneui/base";
import { Avatar, Icon, Text, useTheme } from "@rneui/themed";
import { Pressable, StyleSheet, View } from "react-native";

export default function HeaderUserInfor() {
  const { theme } = useTheme();
  const styles = createStyle(theme);
  const { userLogin, logout } = useAppContext();

  const onPressLogout = () => {
    logout();
  };
  return (
    <View style={styles.container}>
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

        <View style={styles.boxUserInfor}>
          <Icon type={IconType.FONT_AWESOME_5} name="user-alt" size={16} />
          <Text style={{ marginLeft: 8 }}>Quuản lý tài khoản</Text>
        </View>
        <View style={[styles.boxUserInfor]}>
          <Icon type={IconType.FONT_AWESOME_5} name="key" size={16} />
          <Text style={{ marginLeft: 8 }}>Đổi mật khẩu</Text>
        </View>

        <Pressable style={styles.btnLogout} onPress={onPressLogout}>
          <Text> Đăng xuất</Text>
          <Icon
            name="logout"
            size={16}
            type={IconType.ANTDESIGN}
            style={{ marginLeft: 8 }}
          />
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
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.grey4,
      justifyContent: "center",
    },
  });
