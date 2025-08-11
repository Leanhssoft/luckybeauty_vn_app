import { useTheme } from "@rneui/themed";
import { Stack } from "expo-router";

export default function InvoicesStack() {
  const { theme } = useTheme();
  return (
    <Stack
      screenOptions={({ route, navigation }) => ({
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: theme.colors.white,
        },
      })}
    >
      <Stack.Screen name="invoice_menu" options={{ headerShown: false }} />
      <Stack.Screen name="invoices" options={{ title: "Hóa đơn" }} />
      <Stack.Screen name="service_package" options={{ title: "Gói dịch vụ" }} />
      <Stack.Screen name="value_card" options={{ title: "Thẻ giá trị" }} />
    </Stack>
  );
}
