import { useEffect } from "react";
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export const useFadeAndSlideUpAnimation = (
  isVisible: boolean,
  offsetY = 40,
  duration = 300
) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(offsetY);

  useEffect(() => {
    opacity.value = withTiming(isVisible ? 1 : 0, {
      duration,
      easing: Easing.out(Easing.ease),
    });
    translateY.value = withTiming(isVisible ? 0 : offsetY, {
      duration,
      easing: Easing.out(Easing.ease),
    });
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return animatedStyle;
};
