import { useAppContext } from "@/store/react_context/AppProvider";
import { Redirect } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const unstable_settings = {
  drawer: {
    drawerPosition: "left",
  },
};

export const screenOptions = {
  headerStyle: { backgroundColor: "#f8f8f8" },
  headerTintColor: "#333",
  drawerActiveTintColor: "#007aff",
};

export default function DrawerLayout() {
  const { isLogin, isLoading } = useAppContext();

  if (isLoading) return null;
  if (!isLogin) return <Redirect href="/(auth)/login" />;

  // return <Slot />;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerStyle: { backgroundColor: "#f8f8f8" },
          headerTintColor: "#333",
          drawerActiveTintColor: "#007aff",
        }}
      >
        {/* Trang Customer */}
        <Drawer.Screen
          name="index"
          options={{
            title: "Trang chủ",
            drawerLabel: "Trang chủ",
          }}
        />
        {/* Tab + Stack trong nhóm sale */}
        <Drawer.Screen
          name="(sale-stack)"
          options={{
            title: "Bán hàng",
          }}
        />
        <Drawer.Screen
          name="/customer"
          options={{
            title: "Khách hàng",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
