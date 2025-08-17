import { useFadeAndSlideUpAnimation } from "@/hooks/useFadeAndSlideUpAnimation";
import { Theme } from "@rneui/base";
import { useTheme } from "@rneui/themed";
import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ActionBottomProps = {
  visible: boolean;
  children: React.ReactNode;
};

export const ActionBottomNew = ({ visible, children }: ActionBottomProps) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);
  const SCREEN_HEIGHT = Dimensions.get("window").height;
  const animatedStyle = useFadeAndSlideUpAnimation(visible, SCREEN_HEIGHT);

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: "absolute",
          paddingBottom: insets.bottom,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "white",
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
