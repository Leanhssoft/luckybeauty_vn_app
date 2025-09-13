import { ActionBottomNew } from "@/components/action_bottom_delete";
import PageEmpty from "@/components/page_empty";
import { IconType } from "@/enum/IconType";
import { IRoleDto } from "@/services/role_permission/IRoleDto";
import RoleService from "@/services/role_permission/RoleService";
import { IUserBasic } from "@/services/user/IUserBasic";
import CommonFunc from "@/utils/CommonFunc";
import { Theme } from "@rneui/base";
import { Avatar, Icon, Text, useTheme } from "@rneui/themed";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function RoleUsers() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const [txtSearch, setTxtSearch] = useState("");

  const [users, setUsers] = useState<IUserBasic[]>();
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

  const getInforRole_byId = async () => {
    const data = await RoleService.GetRoleForEdit(parseInt(id));
    if (data) {
      setRoleInfor({ ...data });
      initialRoleInforRef.current = data;
    }
  };

  const GetListUser_byRole = async () => {
    const data = await RoleService.GetListUser_byRole(parseInt(id));
    if (data) {
      setUsers([...data]);
    }
  };

  const lengUsers = users?.length ?? 0;

  useEffect(() => {}, []);

  useEffect(() => {
    GetListUser_byRole();
    getInforRole_byId();
  }, [id]);

  useEffect(() => {
    navigation.setOptions({
      title: `Vai trò: ${name}`,
    });
  }, [navigation]);

  const updateListUser_toRole = async () => {
    // chỉ lưu nếu có sự thay đổi vai trò
    const isChanged =
      JSON.stringify(roleInforRef.current) !==
      JSON.stringify(initialRoleInforRef.current);

    if (isChanged) {
      await RoleService.CreateOrUpdateRole(roleInforRef.current);
    }
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* <SearchBar
        placeholder="Tìm kiếm người dùng"
        value={txtSearch}
        onChangeText={(text) => setTxtSearch(text)}
        containerStyle={{ backgroundColor: theme.colors.background }}
        inputContainerStyle={{
          backgroundColor: "white",
        }}
          
      /> */}

      {lengUsers > 0 ? (
        <Text
          style={{
            textAlign: "center",
            fontWeight: 400,
          }}
        >
          Gồm các users
        </Text>
      ) : (
        <PageEmpty
          txt="Chưa có người dùng thuộc vai trò này"
          style={{ height: 80 }}
        />
      )}

      <ScrollView>
        {users?.map((item, index) => (
          <Pressable style={[styles.flexRow, styles.item]} key={item.id}>
            <Avatar
              rounded
              title={CommonFunc.getFirstLetter(item?.userName ?? "")}
              size="medium"
              containerStyle={styles.avatarContainer}
              titleStyle={{
                fontWeight: 500,
              }}
            />
            <View style={styles.infoContainer}>
              <View style={{ gap: 12, justifyContent: "center" }}>
                <Text
                  style={{
                    fontWeight: 600,
                    fontSize: 16,
                  }}
                >
                  {item?.userName}
                </Text>
                <Text style={{ color: theme.colors.grey4, fontSize: 14 }}>
                  {item.emailAddress}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      <ActionBottomNew visible={true}>
        <TouchableOpacity style={[styles.flexRow, styles.footer]}>
          <Icon
            name={"add-circle-outline"}
            type={IconType.IONICON}
            color={theme.colors.white}
            size={30}
          />
          <Text style={{ color: theme.colors.white, fontSize: 16 }}>
            Thêm người dùng vào vai trò
          </Text>
        </TouchableOpacity>
      </ActionBottomNew>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 16,
    },
    flexRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    item: {
      height: 80,
    },
    avatarContainer: {
      width: 50,
      height: 50,
      borderColor: theme.colors.grey5,
      borderWidth: 1,
      borderRadius: 25,
      backgroundColor: theme.colors.grey5,
    },
    infoContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.grey5,
      paddingTop: 10,
      paddingBottom: 10,
      marginLeft: 16,
      flex: 1,
    },
    footer: {
      height: 60,
      gap: 8,
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
    },
  });
