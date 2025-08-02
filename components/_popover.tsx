import { Dimensions, Modal, Pressable, StyleSheet, View } from "react-native";

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

  // ✅ Căn trái popover với Avatar
  let left = position.x;
  if (left + POPUP_WIDTH > screenWidth) {
    left = screenWidth - POPUP_WIDTH - 10;
  }

  const top = position.y + position.height; // nằm ngay dưới Avatar

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.popover, { top, left }]}>{children}</View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  popover: {
    position: "absolute",
    width: POPUP_WIDTH,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
});

export default Popover;
