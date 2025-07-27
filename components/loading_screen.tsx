import { Image, Text, useTheme } from "@rneui/themed";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoadingScreen() {
  const { theme } = useTheme();
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Image
        source={require("../assets/images/app-logo.png")}
        style={{ width: 120, height: 120 }}
      />
      <Text
        style={{ fontSize: 30, fontWeight: 600, color: theme.colors.primary }}
      >
        Lucky Beauty
      </Text>
      <ActivityIndicator size="large" color="#999" style={{ marginTop: 20 }} />
    </SafeAreaView>
  );
}
