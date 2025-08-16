import { AppProvider, useAppContext } from "@/store/react_context/AppProvider";
import { theme } from "@/theme";
import { ThemeProvider } from "@rneui/themed";
import { Redirect, Slot } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function MainLayout() {
  const { isLogin, isLoading } = useAppContext();
  if (isLoading) return null;

  if (!isLogin) {
    // Chuyển hướng tới login nếu chưa đăng nhập
    return <Redirect href="./(auth)/login" />;
  }

  // Nếu đã đăng nhập, load layout chính (drawer)
  return <Slot />;
}

export default function RootLayout() {
  // const { theme } = useTheme();

  return (
    <AppProvider>
      <SQLiteProvider databaseName="expo-luckybeauty.db">
        <GestureHandlerRootView>
          <ThemeProvider theme={theme}>
            <Slot />
          </ThemeProvider>
        </GestureHandlerRootView>
      </SQLiteProvider>
    </AppProvider>
  );
}
