import { SaleManagerStackProvider } from "@/store/react_context/SaleManagerStackProvide";
import { useTheme } from "@rneui/themed";
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
        })}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            title: "Thu ngân",
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="temp_invoice_details"
          options={({ navigation, route }: any) => ({
            title: ` ${route?.param?.maHoaDon}`,
          })}
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
