import { Theme } from "@rneui/base";
import { useTheme } from "@rneui/themed";
import React from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface PopoverProps {
  POPUP_WIDTH?: number;
  visible: boolean;
  onClose: () => void;
  position: { x: number; y: number; width: number; height: number };
  children: React.ReactNode;
}

//const POPUP_WIDTH = 200;

const Popover: React.FC<PopoverProps> = ({
  POPUP_WIDTH = 200,
  visible,
  onClose,
  position,
  children,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const screenWidth = Dimensions.get("window").width;
  const left = Math.min(position.x, screenWidth - POPUP_WIDTH - 10);
  const top = position.y + position.height;

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.popover,
                {
                  width: POPUP_WIDTH,
                  top,
                  left,
                },
              ]}
            >
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default Popover;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
    },
    popover: {
      position: "absolute",
      borderRadius: 8,
      padding: 10,
      elevation: 4,
      backgroundColor: theme.colors.background,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 0.5 },
      shadowOpacity: 0.25,
      shadowRadius: 3, // tương đương với Blur
    },
  });
