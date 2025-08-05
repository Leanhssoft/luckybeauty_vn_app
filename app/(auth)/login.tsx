import { Button, CheckBox, Input, useTheme } from "@rneui/themed";
import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Theme } from "@rneui/base";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { IconType } from "../../enum/IconType";
import { TenantStatus } from "../../enum/TenantStatus";
import { ILoginModel } from "../../services/login/LoginDto";
import LoginService from "../../services/login/LoginService";
import { useAppContext } from "../../store/react_context/AppProvider";

export default function LoginScreen() {
  const { login } = useAppContext();
  const router = useRouter();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [tenancyName, setTenancyName] = useState("");
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({
    userName: "",
    passWord: "",
    tenancyName: "",
  });

  useEffect(() => {
    setErrors({
      userName: "",
      passWord: "",
      tenancyName: "",
    });
  }, []);

  // if (isLogin) {
  //   return <Redirect href="/(drawer)" />;
  // }

  const validateForm = () => {
    let errors = {
      userName: "",
      passWord: "",
      tenancyName: "",
    };
    if (!userName) errors.userName = "Vui lòng nhập tên đăng nhập";
    if (!passWord) errors.passWord = "Vui lòng nhập mật khẩu";
    //if (!tenancyName) errors.tenancyName = "Vui lòng nhập Id cửa hàng";
    setErrors(errors);
    return (
      errors.userName === "" &&
      errors.passWord === "" &&
      errors.tenancyName === ""
    );
  };

  const onPressLogin = async () => {
    if (validateForm()) {
      let tenantId = 1;
      if (tenancyName !== "") {
        const tenantData = await LoginService.checkExistsTenant(tenancyName);
        if (tenantData.state == TenantStatus.AVAILABLE) {
          tenantId = tenantData.tenantId;
        } else {
          switch (tenantData.state) {
            case TenantStatus.NOTFOUND:
              {
                setErrors({
                  ...errors,
                  tenancyName: "Id cửa hàng không tồn tại",
                });
              }
              break;
            case TenantStatus.INACTIVE:
              {
                setErrors({
                  ...errors,
                  tenancyName: "Cửa hàng ngừng hoạt động",
                });
              }
              break;
            default:
              {
                //
              }
              break;
          }
        }
      }
      const input = {
        userNameOrEmailAddress: userName,
        password: passWord,
        rememberClient: true,
        tenantId: tenantId,
      } as ILoginModel;

      await login(input);
      router.replace("/");
    }
  };

  return (
    <>
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.formContainer}>
          <View
            style={{ flexDirection: "row", gap: 8, alignItems: "flex-end" }}
          >
            <Image
              style={styles.logo}
              source={require("../../assets/images/app-logo.png")}
            />
            <Text style={styles.sologan}>Lucky Beauty</Text>
          </View>

          <Text style={styles.lblDangNhap}>Đăng nhập</Text>
          <View style={styles.inputContainer}>
            <Input
              placeholder="tenant"
              leftIcon={{
                type: IconType.OCTICON,
                name: "database",
              }}
              errorStyle={styles.msgErr}
              errorMessage={errors.tenancyName}
              inputContainerStyle={{
                gap: 8,
              }}
              value={tenancyName}
              onChangeText={(text) => {
                setTenancyName(text);
                setErrors({
                  ...errors,
                  tenancyName: "",
                });
              }}
            />
            <Input
              placeholder="username"
              leftIcon={{
                type: IconType.FONT_AWESOME_5,
                name: "user",
              }}
              errorStyle={styles.msgErr}
              errorMessage={errors.userName}
              inputContainerStyle={{
                gap: 8,
              }}
              value={userName}
              onChangeText={(text) => {
                setUserName(text);
                setErrors({
                  ...errors,
                  userName: "",
                });
              }}
            />
            <Input
              placeholder="password"
              leftIcon={{
                type: IconType.OCTICON,
                name: "key",
              }}
              secureTextEntry
              errorStyle={styles.msgErr}
              errorMessage={errors.passWord}
              inputContainerStyle={{
                gap: 8,
              }}
              value={passWord}
              onChangeText={(text) => {
                setPassWord(text);
                setErrors({
                  ...errors,
                  passWord: "",
                });
              }}
            />
            <View style={[styles.inputBox, styles.checkBoxContainer]}>
              <CheckBox
                center
                title={"Ghi nhớ"}
                checked={rememberMe}
                containerStyle={{
                  paddingLeft: 0,
                }}
                onPress={() => setRememberMe(!rememberMe)}
              />

              <Text style={styles.linkQuenMatKhau}>Quên mật khẩu</Text>
            </View>
            <Button
              title={"Đăng nhập"}
              size="lg"
              onPress={onPressLogin}
              containerStyle={{
                marginTop: 20,
                borderRadius: 4,
              }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.white,
      justifyContent: "center", // Căn giữa theo trục dọc
    },
    formContainer: {
      backgroundColor: theme.colors.white,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.colors.greyOutline,
      borderRadius: 8,
      padding: 32,
      flex: 1,
    },
    logo: {
      resizeMode: "stretch",
      width: 40,
      height: 40,
    },
    sologan: {
      fontSize: 25,
      fontWeight: 600,
      color: theme.colors.primary,
    },
    lblDangNhap: {
      fontSize: 20,
      fontWeight: 500,
      marginTop: 12,
    },
    linkQuenMatKhau: {
      textDecorationColor: theme.colors.primary,
      textDecorationStyle: "solid",
      textDecorationLine: "underline",
      color: theme.colors.primary,
      paddingRight: 10,
    },
    inputContainer: {
      paddingTop: 20,
      paddingBottom: 20,
      width: "100%",
    },
    checkBoxContainer: {
      justifyContent: "space-between",
    },
    inputBox: {
      flexDirection: "row",
      alignItems: "center",
    },
    inputIcon: {
      color: theme.colors.grey1,
      fontSize: 18,
      flex: 1,
    },
    textInput: {
      width: "100%",
      flex: 11,
    },
    msgErr: {
      color: theme.colors.error,
      fontSize: 12,
      marginTop: 8,
    },
  });
