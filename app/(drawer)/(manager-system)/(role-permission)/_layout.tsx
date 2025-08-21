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
          gestureEnabled: true,
          drawerLockMode: "locked-closed", // chặn Drawer gesture
          //   headerLeft: () => (
          //     <TouchableOpacity onPress={() => router.back()}>
          //       <Icon name="arrow-back-ios" size={24} />
          //     </TouchableOpacity>
          //   ),
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
          gestureEnabled: true,
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
