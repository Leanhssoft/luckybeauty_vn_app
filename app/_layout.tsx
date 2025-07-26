import { ThemeProvider, useTheme } from "@rneui/themed";

import { Slot } from "expo-router";

export default function RootLayout() {
  const { theme } = useTheme();

  return (
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  );
}
