import { IconType } from "@/enum/IconType";
import { SaleManagerStackProvider } from "@/store/react_context/SaleManagerStackProvide";
import { Icon, useTheme } from "@rneui/themed";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SaleStackLayout() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <SaleManagerStackProvider>
      <Stack
        screenOptions={({ route, navigation }) => ({
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: theme.colors.white,
          },
          headerLeft: () => (
            <Icon
              style={{ marginTop: insets.top + 10 }}
              name="arrow-back"
              type={IconType.IONICON}
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      >
        {/* Tabs sẽ render tại name="(tabs)" */}
        <Stack.Screen
          name="(tabs)"
          options={{
            title: "Thu ngân",
            headerShown: false,
          }}
        />

        {/* Màn hình Thanh Toán riêng */}
        <Stack.Screen
          name="temp_invoice_details"
          options={{
            title: "Thanh toán",
          }}
        />
        <Stack.Screen
          name="thanhtoan"
          options={{
            title: "Thanh toán",
          }}
        />
      </Stack>
    </SaleManagerStackProvider>
  );
}
