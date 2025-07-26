import { Drawer } from "expo-router/drawer";
export const DrawerLayout = () => {
  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: "#f8f8f8" },
        headerTintColor: "#333",
        drawerActiveTintColor: "#007aff",
      }}
    >
      {/* Tab + Stack trong nhóm sale */}
      {/* <Drawer.Screen
        name="(sale-stack)"
        options={{
          title: 'Bán hàng',
        }}
      /> */}

      {/* Trang Customer */}
      <Drawer.Screen
        name="dashbord"
        options={{
          title: "Trang chủ",
        }}
      />
      <Drawer.Screen
        name="customer"
        options={{
          title: "Khách hàng",
        }}
      />
    </Drawer>
  );
};
