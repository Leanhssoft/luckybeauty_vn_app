import { Icon } from "@rneui/themed";
import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function RolePermissionStack() {
  return (
    <Stack>
      <Stack.Screen
        name="role"
        options={() => ({
          title: "Vai trò",
          drawerLockMode: "locked-closed", // chặn Drawer gesture
          headerLeft: ({ canGoBack }) =>
            canGoBack ? (
              <TouchableOpacity onPress={() => router.back()}>
                <Icon name="arrow-back-ios" size={24} />
              </TouchableOpacity>
            ) : null,
        })}
      />
      <Stack.Screen
        name="permission"
        options={() => ({
          title: "Cài đặt quyền",
          headerTitleAlign: "left",
          drawerLockMode: "locked-closed", // chặn Drawer gesture
          headerLeft: ({ canGoBack }) =>
            canGoBack ? (
              <TouchableOpacity onPress={() => router.back()}>
                <Icon name="arrow-back-ios" size={24} />
              </TouchableOpacity>
            ) : null,
        })}
      />
      <Stack.Screen
        name="role_users"
        options={() => ({
          title: "Người dùng theo vai trò",
          headerTitleAlign: "left",
          drawerLockMode: "locked-closed", // chặn Drawer gesture
          headerLeft: ({ canGoBack }) =>
            canGoBack ? (
              <TouchableOpacity onPress={() => router.back()}>
                <Icon name="arrow-back-ios" size={24} />
              </TouchableOpacity>
            ) : null,
        })}
      />
    </Stack>
  );
}
