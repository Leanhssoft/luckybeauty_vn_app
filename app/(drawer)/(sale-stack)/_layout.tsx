import { Stack } from "expo-router";

export default function SaleStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#f2f2f2" },
        headerTintColor: "#333",
      }}
    >
      {/* Tabs sẽ render tại name="(tabs)" */}
      <Stack.Screen
        name="(tabs)"
        options={{
          title: "Thu ngân",
        }}
      />

      {/* Màn hình Thanh Toán riêng */}
      <Stack.Screen
        name="thanhtoan"
        options={{
          title: "Thanh toán",
        }}
      />
    </Stack>
  );
}
