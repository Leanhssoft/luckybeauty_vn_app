import { MainNavigation } from "@/enum/navigation/RouteName";
import { MainDrawerParamList } from "@/enum/navigation/RouteParam";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Icon } from "@rneui/themed";
import { Stack, useNavigation, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

type CustomerStackProps = DrawerNavigationProp<
  MainDrawerParamList,
  MainNavigation.CUSTOMER_STACK
>;

export default function CustomerStack() {
  const route = useRouter();
  const navigationDrawer = useNavigation<CustomerStackProps>();

  return (
    <Stack screenOptions={{ headerTitleAlign: "left" }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Khách hàng",
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
        name="details/[id]"
        options={{
          title: "Thông tin khách hàng",
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
