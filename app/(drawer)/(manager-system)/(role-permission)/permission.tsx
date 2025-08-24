import { IconType } from "@/enum/IconType";
import { IPermissionDto } from "@/services/role_permission/IPermissionDto";
import { IRoleDto } from "@/services/role_permission/IRoleDto";
import PermissionService from "@/services/role_permission/PermissionService";
import RoleService from "@/services/role_permission/RoleService";
import { Theme } from "@rneui/base";
import { Icon, SearchBar, Switch, Text, useTheme } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

type IRolePermissionProps = IRoleDto & {
  expandedPermissions?: string[];
};

export default function Permission() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { id } = useLocalSearchParams<{ id: string }>();
  const [textSearch, setTextSearch] = useState<string>("");
  const [allPermission, setAllPermission] = useState<IPermissionDto[]>();

  const [roleInfor, setRoleInfor] = useState<IRolePermissionProps>({
    id: -1,
    name: "",
    displayName: "",
    grantedPermissions: [],
  });

  const getAllPermission = async () => {
    const data = await PermissionService.GetAllPermissions();
    if (data !== null && data?.items?.length > 0) {
      const arr = data?.items?.[0].children;
      setAllPermission([...arr]);
    }
  };

  const getInforRole_byId = async () => {
    const data = await RoleService.GetRoleForEdit(parseInt(id));
    if (data) {
      setRoleInfor({
        id: data?.id,
        name: data?.name,
        displayName: data?.displayName,
        grantedPermissions: data?.grantedPermissions,
        expandedPermissions: [],
      });
    }
  };

  useEffect(() => {
    getAllPermission();
  }, []);

  useEffect(() => {
    getInforRole_byId();
  }, [id]);

  const onOffPermissions = async (
    permissionName: string,
    isParent = false,
    children: string[] = []
  ) => {
    if (isParent) {
      setRoleInfor({
        ...roleInfor,
        grantedPermissions: roleInfor?.grantedPermissions?.includes(
          permissionName
        )
          ? roleInfor?.grantedPermissions?.filter(
              (x) => !x.includes(permissionName)
            )
          : [
              permissionName,
              ...children,
              ...(roleInfor?.grantedPermissions ?? []),
            ],
      });
    } else {
      setRoleInfor({
        ...roleInfor,
        grantedPermissions: roleInfor?.grantedPermissions?.includes(
          permissionName
        )
          ? roleInfor?.grantedPermissions?.filter((x) => x !== permissionName)
          : [permissionName, ...(roleInfor?.grantedPermissions ?? [])],
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.flexRow, { gap: 8, justifyContent: "center" }]}>
        <Text> Vai trò:</Text>
        <Text style={{ fontWeight: 600 }}> {roleInfor?.displayName}</Text>
      </View>
      <SearchBar
        placeholder="Tìm kiếm vai trò"
        autoFocus
        value={textSearch}
        onChangeText={(txt) => setTextSearch(txt)}
        lightTheme
        containerStyle={{ borderRadius: 4, marginTop: 16 }}
        inputContainerStyle={{
          backgroundColor: theme.colors.grey5,
        }}
      />

      <ScrollView
        style={{
          marginTop: 16,
          gap: 16,
          borderRadius: 4,
          borderWidth: 1,
          borderColor: theme.colors.grey5,
        }}
      >
        {allPermission?.map((parent, index) => (
          <View
            key={parent.name}
            style={
              {
                // borderRadius: 8,
                // borderWidth: 1,
                // borderColor: theme.colors.grey5,
              }
            }
          >
            <View>
              <View
                style={[
                  styles.flexRow,
                  {
                    padding: 8,
                    justifyContent: "space-between",
                    backgroundColor: theme.colors.grey5,
                  },
                ]}
              >
                <View style={[styles.flexRow, { gap: 16 }]}>
                  {/* <Icon name="chevron-up" type={IconType.IONICON} size={18} /> */}
                  <Icon name="chevron-down" type={IconType.IONICON} size={18} />
                  <Text
                    style={{
                      fontWeight: 600,
                      fontSize: 16,
                    }}
                  >
                    {parent.displayName}
                  </Text>
                </View>

                <Switch
                  style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                  // đổi màu của background
                  trackColor={{
                    false: "#E0E0E0", // OFF: xám nhạt
                    true: "rgba(250, 173, 20, 0.8)", // ON: vàng cam nhạt
                  }}
                  // đổi màu nút tròn
                  thumbColor={
                    roleInfor?.grantedPermissions?.includes(parent?.name) ??
                    false
                      ? theme.colors.white
                      : theme.colors.grey5
                  }
                  value={
                    roleInfor?.grantedPermissions?.includes(parent?.name) ??
                    false
                  }
                  onValueChange={() =>
                    onOffPermissions(
                      parent?.name,
                      true,
                      parent?.children?.map((x) => {
                        return x.name;
                      })
                    )
                  }
                />
              </View>

              <View style={{ gap: 8 }}>
                {parent?.children?.map((child, index2) => (
                  <View
                    key={child.name}
                    style={[
                      styles.flexRow,
                      { justifyContent: "space-between", padding: 8 },
                    ]}
                  >
                    <Text>{child.displayName}</Text>
                    <Switch
                      style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                      trackColor={{
                        true: "#1976D2",
                        false: "#E0E0E0",
                      }}
                      // đổi màu nút tròn
                      thumbColor={
                        roleInfor?.grantedPermissions?.includes(child?.name) ??
                        false
                          ? theme.colors.white
                          : theme.colors.grey5
                      }
                      value={
                        roleInfor?.grantedPermissions?.includes(child?.name) ??
                        false
                      }
                      onValueChange={() => onOffPermissions(child?.name, false)}
                    />
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
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
  });
