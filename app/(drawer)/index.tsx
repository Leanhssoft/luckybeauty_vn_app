import { Text, View } from "react-native";

export const screenOptions = {
  title: "Trang chủ",
  drawerLabel: "Trang chủ",
};

export default function Dashboard() {
  return (
    <View style={{ backgroundColor: "yellow" }}>
      <Text>Dashboard</Text>
    </View>
  );
}
