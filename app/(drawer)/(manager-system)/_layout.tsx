import { MainNavigation } from "@/enum/navigation/RouteName";
import { MainDrawerParamList } from "@/enum/navigation/RouteParam";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Icon } from "@rneui/themed";
import { Stack, useNavigation, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

type ManagerSystemLayoutProps = DrawerNavigationProp<
  MainDrawerParamList,
  MainNavigation.MANAGER_SYSTEM_STACK
>;
export default function ManagerSystemStack() {
  const route = useRouter();
  const navigationDrawer = useNavigation<ManagerSystemLayoutProps>();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigationDrawer.openDrawer()}>
              <Icon
                name="menu"
                size={24}
                style={{
                  paddingRight: 16,
                }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="(role-permission)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="user"
        options={{
          title: "Người dùng",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => route.back()}>
              <Icon name="arrow-back-ios" size={24} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
