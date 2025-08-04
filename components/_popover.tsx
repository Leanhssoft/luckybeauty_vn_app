import React from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface PopoverProps {
  visible: boolean;
  onClose: () => void;
  position: { x: number; y: number; width: number; height: number };
  children: React.ReactNode;
}

const POPUP_WIDTH = 200;

const Popover: React.FC<PopoverProps> = ({
  visible,
  onClose,
  position,
  children,
}) => {
  const screenWidth = Dimensions.get("window").width;
  const left = Math.min(position.x, screenWidth - POPUP_WIDTH - 10);
  const top = position.y + position.height;

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.popover, { top, left }]}>{children}</View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default Popover;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  popover: {
    position: "absolute",
    width: POPUP_WIDTH,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    elevation: 4,
  },
});
