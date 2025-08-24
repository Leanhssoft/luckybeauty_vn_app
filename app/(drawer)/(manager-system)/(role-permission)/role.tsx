import { IconType } from "@/enum/IconType";
import { IPagedRequestDto } from "@/services/commonDto/IPagedRequestDto";
import { IRoleDto } from "@/services/role_permission/IRoleDto";
import RoleService from "@/services/role_permission/RoleService";
import CommonFunc from "@/utils/CommonFunc";
import { Theme } from "@rneui/base";
import { Avatar, Button, Icon, Input, Text, useTheme } from "@rneui/themed";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function Role() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [isClickAdd, setIsClickAdd] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [errors, setErrors] = useState("");

  const [listRole, setListRole] = useState<IRoleDto[]>([]);

  const GetAllRole = async () => {
    const param: IPagedRequestDto = {
      keyword: "",
      skipCount: 1,
      maxResultCount: 100,
    };
    const data = await RoleService.GetAll(param);
    if (data !== null) {
      setListRole([...data?.items]);
    }
  };

  useEffect(() => {
    GetAllRole();
  }, []);

  const onSaveRole = async () => {
    if (CommonFunc.checkNull(roleName)) {
      setErrors("Vui lòng nhập tên vai trò");
      return;
    }
    const input: IRoleDto = {
      id: 0,
      name: roleName,
      displayName: roleName,
    };
    const data = await RoleService.CreateOrUpdateRole(input);
  };
  return (
    <View style={styles.container}>
      {!isClickAdd ? (
        <TouchableOpacity
          style={[styles.flexRow, { gap: 8 }]}
          onPress={() => setIsClickAdd(true)}
        >
          <Icon
            name="add-circle-outline"
            type={IconType.IONICON}
            color={theme.colors.primary}
          />
          <Text style={{ color: theme.colors.primary }}>Thêm mới vai trò</Text>
        </TouchableOpacity>
      ) : (
        <View style={[styles.flexRow]}>
          <View style={{ flex: 9 }}>
            {errors && (
              <Text style={{ fontSize: 13, color: theme.colors.error }}>
                {errors}
              </Text>
            )}
            <Input
              placeholder="Tên vai trò"
              value={roleName}
              onChangeText={(txt) => setRoleName(txt)}
            />
            <Button title={"Lưu"} size="sm" onPress={onSaveRole} />
          </View>
          <Icon
            name="remove-circle-outline"
            size={30}
            containerStyle={{ flex: 4 }}
            color={theme.colors.error}
            type={IconType.IONICON}
            onPress={() => setIsClickAdd(false)}
          />
        </View>
      )}

      <View style={{ marginTop: 24, gap: 16 }}>
        {listRole?.map((x) => (
          <View style={[styles.flexRow, { gap: 16 }]} key={x.id}>
            <TouchableOpacity style={styles.card}>
              <Text
                style={{ textAlign: "center", fontSize: 18, fontWeight: 600 }}
              >
                {x.displayName}
              </Text>
              <View style={[styles.flexRow, { marginTop: 16 }]}>
                <Avatar
                  title="A"
                  rounded
                  containerStyle={{ backgroundColor: "#ccc" }}
                />
                <Avatar
                  title="B"
                  rounded
                  containerStyle={{ backgroundColor: "#ccc", marginLeft: -12 }}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 4 }}
              onPress={() =>
                router.navigate({
                  pathname:
                    "/(drawer)/(manager-system)/(role-permission)/permission",
                  params: {
                    id: x.id.toString(),
                  },
                })
              }
            >
              <View style={[styles.flexRow]}>
                <Text style={{ fontSize: 12, color: theme.colors.primary }}>
                  Cài đặt quyền
                </Text>
                <Icon
                  name="chevron-double-right"
                  color={theme.colors.primary}
                  type={IconType.MATERIAL_COMMUNITY}
                />
              </View>
            </TouchableOpacity>
            {/* <Button title={"Cài đặt quyền"} />
            <Button title={"Xóa"} /> */}
          </View>
        ))}
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    flexRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    card: {
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      padding: 16,
      flex: 9,
    },
  });
