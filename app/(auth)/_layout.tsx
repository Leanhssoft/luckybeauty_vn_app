// app/(auth)/_layout.tsx
import { useAppContext } from "@/store/react_context/AppProvider";
import { Redirect, Slot } from "expo-router";

export default function AuthLayout() {
  const { isLogin, isLoading } = useAppContext();

  if (isLoading) return null; // hoặc <SplashScreen />
  if (isLogin) return <Redirect href="/" />;

  return <Slot />;
}
