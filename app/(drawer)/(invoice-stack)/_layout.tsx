import { MainNavigation } from "@/enum/navigation/RouteName";
import { MainDrawerParamList } from "@/enum/navigation/RouteParam";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Icon, useTheme } from "@rneui/themed";
import { Stack, useNavigation, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type InvoiceStackProps = DrawerNavigationProp<
  MainDrawerParamList,
  MainNavigation.INVOICE_STACK
>;

export default function InvoiceStack() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigationDrawer = useNavigation<InvoiceStackProps>();
  const route = useRouter();

  return (
    <Stack
      screenOptions={({ route, navigation }) => ({
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: theme.colors.white,
        },
        headerShown: false,
      })}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Chọn loại hóa đơn",
          headerTitleAlign: "left",
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
        name="invoices"
        options={{
          title: "Hóa đơn",
          headerTitle: "Hóa đơn",
          headerShown: true,

          headerLeft: () => (
            <TouchableOpacity onPress={() => route.back()}>
              <Icon name="arrow-back-ios" size={24} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="service_package"
        options={{
          title: "Gói dịch vụ",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => route.back()}>
              <Icon name="arrow-back-ios" size={24} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="value_card"
        options={{
          title: "Thẻ giá trị",
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
