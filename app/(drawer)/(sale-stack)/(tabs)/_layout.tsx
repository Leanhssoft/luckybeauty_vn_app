import { Tabs } from "expo-router";

export default function SaleTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007aff",
      }}
    >
      <Tabs.Screen
        name="product"
        options={{
          title: "Sản phẩm",
        }}
      />
      <Tabs.Screen
        name="temp-invoice"
        options={{
          title: "Hóa đơn tạm",
        }}
      />
    </Tabs>
  );
}
