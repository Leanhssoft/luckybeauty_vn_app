import { IconType } from "@/enum/IconType";
import UserService from "@/services/user/UserService";
import { useAppContext } from "@/store/react_context/AppProvider";
import { IPropsSimpleDialog } from "@/type/IPropsSimpleDialog";
import { PropModal } from "@/type/PropModal";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Theme } from "@rneui/base";
import { Button, Icon, useTheme } from "@rneui/themed";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as yup from "yup";
import { BackDropView } from "../back_drop_view";
import { SimpleDialog } from "../simple_dialog";
import { TextFieldCustom } from "../text_filed_custom";

const ModalChangePassWord = ({
  isShow,
  onClose,
  onSave,
}: PropModal<string>) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { userLogin, logout } = useAppContext();
  const insets = useSafeAreaInsets();

  const [isHideOldPassword, setIsHideOldPassword] = useState(true);
  const [isHideNewPassword, setIsHideNewPassword] = useState(true);
  const [isHideConfirmPassword, setIsHideConfirmPassword] = useState(true);

  const [objSimpleDialog, setObjSimpleDialog] = useState<IPropsSimpleDialog>();

  const schema = yup.object({
    oldPassword: yup.string().required("Vui lòng nhập mật khẩu cũ"),
    newPassword: yup.string().required("Vui lòng nhập mật khẩu mới"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], "Mật khẩu xác nhận phải trùng khớp")
      .required("Vui lòng xác nhận lại mật khẩu mới"),
  });

  type FormData = yup.InferType<typeof schema>;
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  const agree = async (data: FormData) => {
    const matchPassword = await UserService.checkMatchesPassword(
      userLogin?.id ?? 0,
      data.oldPassword
    );
    if (!matchPassword) {
      setError("oldPassword", {
        type: "manual",
        message: "Mật khẩu cũ chưa chính xác",
      });
      return;
    }

    const matchPassword_NewOld = await UserService.checkMatchesPassword(
      userLogin?.id ?? 0,
      data.newPassword
    );

    await UserService.changeUserPassword(data.oldPassword, data.newPassword);

    setObjSimpleDialog({
      ...objSimpleDialog,
      isShow: true,
      mes: "Đổi mật khẩu thành công",
    });
    // todod save diary

    if (!matchPassword_NewOld) {
      logout();
    }
  };

  return (
    <Modal visible={isShow} transparent={true} animationType="slide">
      <SimpleDialog
        isShow={objSimpleDialog?.isShow ?? false}
        mes={objSimpleDialog?.mes}
        onClose={() =>
          setObjSimpleDialog({ ...objSimpleDialog, isShow: false })
        }
      />
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
            position: "relative",
          }}
        >
          <TouchableOpacity
            onPress={onClose}
            style={{
              position: "absolute",
              right: 0,
              top: 10,
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
          <View
            style={{
              gap: 12,
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 16,
            }}
          >
            <Fontisto name="unlocked" size={80} />
            {/* <Text
              style={{ textAlign: "center", fontSize: 20, fontWeight: 600 }}
            >
              Đổi mật khẩu
            </Text> */}
          </View>

          <View style={{ gap: 8, marginTop: 24 }}>
            <Controller
              control={control}
              name="oldPassword"
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextFieldCustom
                  secureTextEntry={isHideOldPassword}
                  label="Mật khẩu cũ"
                  variant="outlined"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors?.oldPassword ?? false ? true : false}
                  helperText={errors?.oldPassword?.message}
                  endIcon={
                    <Ionicons
                      name={isHideOldPassword ? "eye-off" : "eye"}
                      size={25}
                      onPress={() => setIsHideOldPassword(!isHideOldPassword)}
                    />
                  }
                />
              )}
            />
            <Controller
              control={control}
              name="newPassword"
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextFieldCustom
                  label="Mật khẩu mới"
                  secureTextEntry={isHideNewPassword}
                  variant="outlined"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors?.newPassword ?? false ? true : false}
                  helperText={errors?.newPassword?.message}
                  endIcon={
                    <Ionicons
                      name={isHideNewPassword ? "eye-off" : "eye"}
                      size={25}
                      onPress={() => setIsHideNewPassword(!isHideNewPassword)}
                    />
                  }
                />
              )}
            />
            <Controller
              control={control}
              name="confirmPassword"
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextFieldCustom
                  secureTextEntry={isHideConfirmPassword}
                  variant="outlined"
                  label="Xác nhận mật khẩu mới"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors?.confirmPassword ?? false ? true : false}
                  helperText={errors?.confirmPassword?.message}
                  endIcon={
                    <Ionicons
                      name={isHideConfirmPassword ? "eye-off" : "eye"}
                      size={25}
                      onPress={() =>
                        setIsHideConfirmPassword(!isHideConfirmPassword)
                      }
                    />
                  }
                />
              )}
            />
            <Button
              size="md"
              title={"Đổi mật khẩu"}
              containerStyle={{
                borderRadius: 16,
                borderColor: theme.colors.primary,
              }}
              onPress={handleSubmit(agree)}
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
