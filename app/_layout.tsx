import { AppProvider, useAppContext } from "@/store/react_context/AppProvider";
import {
  StatusBarProvider,
  useStatusBarContext,
} from "@/store/react_context/StatusBarProvider";
import { theme } from "@/theme";
import { ThemeProvider } from "@rneui/themed";
import { Redirect, Slot } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

export function RootLayout() {
  const insets = useSafeAreaInsets();
  const { config, setConfig } = useStatusBarContext();

  const themeMode = theme.mode;

  const background_status = () => {
    if (themeMode === "dark") {
      setConfig({
        style: "light",
        backgroundColor: theme.lightColors?.background ?? "#fff",
      });
    } else {
      setConfig({
        style: "dark",
        backgroundColor: theme.darkColors?.background ?? "#fff",
      });
    }
  };

  useEffect(() => {
    background_status();
  }, [themeMode]);

  return (
    <AppProvider>
      <SQLiteProvider databaseName="expo-luckybeauty.db">
        <GestureHandlerRootView>
          <ThemeProvider theme={theme}>
            <StatusBar style={config.style} />
            {/* iOS: giả lập background cho status bar */}
            {/* {Platform.OS === "ios" && (
              <View
                style={{
                  zIndex: 999, 
                  height: insets.top,
                  backgroundColor: config.backgroundColor,
                }}
              />
            )} */}
            <Slot />
          </ThemeProvider>
        </GestureHandlerRootView>
      </SQLiteProvider>
    </AppProvider>
  );
}

export default function LayoutWithProvider() {
  return (
    <StatusBarProvider>
      <RootLayout />
    </StatusBarProvider>
  );
}
