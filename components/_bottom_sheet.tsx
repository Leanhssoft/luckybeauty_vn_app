import { useTheme } from "@rneui/themed";
import React, { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

type BottomSheetProps = {
  isOpen: SharedValue<boolean>;
  toggleSheet: () => void;
  duration?: number;
  children: ReactNode;
};

export default function BottomSheet({
  isOpen,
  toggleSheet,
  duration = 500,
  children,
}: BottomSheetProps) {
  const { theme } = useTheme();
  const colorScheme = useColorScheme();
  const height = useSharedValue(0);

  const backgroundColorSheetStyle = {
    backgroundColor: colorScheme === "light" ? "#f8f9ff" : "#272B3C",
  };

  const progress = useDerivedValue(() =>
    withTiming(isOpen.value ? 0 : 1, { duration })
  );

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: progress.value * 2 * height.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    zIndex: isOpen.value
      ? 1
      : withDelay(duration, withTiming(-1, { duration: 0 })),
  }));

  return (
    <>
      <Animated.View style={[sheetStyles.backdrop, backdropStyle]}>
        <TouchableOpacity style={{ flex: 1 }} onPress={toggleSheet} />
      </Animated.View>
      <Animated.View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={[
          sheetStyles.sheet,
          sheetStyle,
          { backgroundColor: theme.colors.background },
        ]}
      >
        {children}
      </Animated.View>
    </>
  );
}

const sheetStyles = StyleSheet.create({
  sheet: {
    padding: 16,
    height: 150,
    width: "100%",
    position: "absolute",
    bottom: 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
});
