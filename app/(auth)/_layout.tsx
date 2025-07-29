// app/(auth)/_layout.tsx
import LoadingScreen from "@/components/loading_screen";
import { useAppContext } from "@/store/react_context/AppProvider";
import { Redirect, Slot } from "expo-router";

export default function AuthLayout() {
  const { isLogin, isLoading } = useAppContext();

  if (isLoading) return <LoadingScreen />;
  if (isLogin) return <Redirect href="/" />;

  return <Slot />;
}
