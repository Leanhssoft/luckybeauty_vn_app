import { TextLink } from "@/components/_text_link";
import { IconType } from "@/enum/IconType";
import { IPermissionDto } from "@/services/role_permission/IPermissionDto";
import { IRoleDto } from "@/services/role_permission/IRoleDto";
import PermissionService from "@/services/role_permission/PermissionService";
import RoleService from "@/services/role_permission/RoleService";
import CommonFunc from "@/utils/CommonFunc";
import { Theme } from "@rneui/base";
import { Icon, SearchBar, Switch, Text, useTheme } from "@rneui/themed";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function Permission() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [textSearch, setTextSearch] = useState<string>("");
  const [expandedPermissions, setExpandedPermissions] = useState<string[]>([]);
  const [allPermission, setAllPermission] = useState<IPermissionDto[]>();
  const [roleInfor, setRoleInfor] = useState<IRoleDto>({
    id: -1,
    name: "",
    displayName: "",
    grantedPermissions: [],
  });

  // Lưu giá trị ban đầu (chỉ set 1 lần khi mount)
  const initialRoleInforRef = useRef(roleInfor);
  const roleInforRef = useRef(roleInfor);
  useEffect(() => {
    roleInforRef.current = roleInfor;
  }, [roleInfor]);

  const listSearch = allPermission?.filter((x) => {
    const txt = CommonFunc.convertString_toEnglish(textSearch);
    return CommonFunc.convertString_toEnglish(x.displayName)?.indexOf(txt) > -1;
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
      setRoleInfor({ ...data });
      initialRoleInforRef.current = data;
    }
  };

  useEffect(() => {
    getAllPermission();
  }, []);

  useEffect(() => {
    getInforRole_byId();
  }, [id]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <TextLink lable="Xong" onPress={savePermissionRole} />,
    });
  }, [navigation]);

  const savePermissionRole = async () => {
    // chỉ lưu nếu có sự thay đổi vai trò
    const isChanged =
      JSON.stringify(roleInforRef.current) !==
      JSON.stringify(initialRoleInforRef.current);

    if (isChanged) {
      await RoleService.CreateOrUpdateRole(roleInforRef.current);
    }
    router.back();
  };

  const onExpandedPermissions = (permissionName: string) => {
    setExpandedPermissions((prev) => {
      return prev.includes(permissionName)
        ? prev?.filter((x) => !x.includes(permissionName))
        : [permissionName, ...prev];
    });
  };

  const Parent_onOffPermissions = (
    permissionName: string,
    children: string[] = []
  ) => {
    setRoleInfor((prev) => {
      return {
        ...prev,
        grantedPermissions: prev?.grantedPermissions?.includes(permissionName)
          ? prev?.grantedPermissions?.filter((x) => !x.includes(permissionName))
          : [permissionName, ...children, ...(prev?.grantedPermissions ?? [])],
      };
    });
  };
  const Children_onOffPermissions = async (
    permissionName: string,
    parentName: string
  ) => {
    setRoleInfor((prev) => {
      let arr = prev?.grantedPermissions?.includes(permissionName)
        ? prev?.grantedPermissions?.filter((x) => !x.includes(permissionName))
        : [permissionName, ...(prev?.grantedPermissions ?? [])];
      // get all child by parent name
      const arrChildNew = arr?.filter(
        (x) => x.includes(parentName) && x !== parentName
      );
      if (arrChildNew?.length === 0) {
        // remove parent
        arr = arr?.filter((x) => x !== parentName);
      } else {
        if (arrChildNew.filter((x) => x === parentName)?.length === 0) {
          arr = [parentName, ...arr];
        }
      }
      return {
        ...prev,
        grantedPermissions: arr,
      };
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.flexRow, { gap: 8, justifyContent: "center" }]}>
        <Text> Vai trò:</Text>
        <Text style={{ fontWeight: 600 }}> {roleInfor?.displayName}</Text>
      </View>
      <SearchBar
        placeholder="Tìm kiếm vai trò"
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
        {listSearch?.map((parent, index) => (
          <View
            key={parent.name}
            style={{
              borderBottomColor: theme.colors.white,
              borderBottomWidth: 1,
            }}
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
                  {!expandedPermissions?.includes(parent?.name) ? (
                    <Icon
                      name="chevron-up"
                      type={IconType.IONICON}
                      size={18}
                      onPress={() => onExpandedPermissions(parent?.name)}
                    />
                  ) : (
                    <Icon
                      name="chevron-down"
                      type={IconType.IONICON}
                      size={18}
                      onPress={() => onExpandedPermissions(parent?.name)}
                    />
                  )}

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
                    Parent_onOffPermissions(
                      parent?.name,
                      parent?.children?.map((x) => {
                        return x.name;
                      })
                    )
                  }
                />
              </View>
              {expandedPermissions?.includes(parent?.name) && (
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
                        style={{
                          transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                        }}
                        trackColor={{
                          true: "#1976D2",
                          false: "#E0E0E0",
                        }}
                        // đổi màu nút tròn
                        thumbColor={
                          roleInfor?.grantedPermissions?.includes(
                            child?.name
                          ) ?? false
                            ? theme.colors.white
                            : theme.colors.grey5
                        }
                        value={
                          roleInfor?.grantedPermissions?.includes(
                            child?.name
                          ) ?? false
                        }
                        onValueChange={() =>
                          Children_onOffPermissions(child?.name, parent?.name)
                        }
                      />
                    </View>
                  ))}
                </View>
              )}
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
