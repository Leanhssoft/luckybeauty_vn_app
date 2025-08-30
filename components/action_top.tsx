import { useFadeAndSlideUpAnimation } from "@/hooks/useFadeAndSlideUpAnimation";
import { Theme } from "@rneui/base";
import { useTheme } from "@rneui/themed";
import React from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ActionBottomProps = {
  visible: boolean;
  children: React.ReactNode;
};

export const ActionTop = ({ visible, children }: ActionBottomProps) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);
  const animatedStyle = useFadeAndSlideUpAnimation(visible, -40);

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    flexRow: {
      flexDirection: "row",
      alignItems: "center",
    },
  });
