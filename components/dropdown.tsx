import { Icon, Text, useTheme } from "@rneui/themed";
import React, { useState } from "react";
import {
  LayoutRectangle,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ISelect } from "../services/commonDto/ISelect";

type Props = {
  options: ISelect[];
  itemSelected: ISelect | null;
  onSelect: (item: ISelect) => void;
};

const Dropdown: React.FC<Props> = ({ options, itemSelected, onSelect }) => {
  const { theme } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const [dropdownLayout, setDropdownLayout] = useState<LayoutRectangle | null>(
    null
  );

  const toggleDropdown = () => {
    setMenuVisible(!menuVisible);
  };

  const handleSelect = (item: ISelect) => {
    onSelect(item);
    setMenuVisible(false);
  };

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={toggleDropdown}
        onLayout={(event) => setDropdownLayout(event.nativeEvent.layout)}
      >
        <Text style={styles.selectedText}>{itemSelected?.text ?? "Chọn"}</Text>
        <Icon name="arrow-drop-down" />
      </TouchableOpacity>

      {menuVisible && dropdownLayout && (
        <>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setMenuVisible(false)}
          />

          <View
            style={[
              styles.menu,
              {
                top: dropdownLayout.y + dropdownLayout.height + 5,
                left: dropdownLayout.x,
                width: dropdownLayout.width,
              },
            ]}
          >
            {options?.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleSelect(item)}
              >
                <Text>{item.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  dropdown: {
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  selectedText: {
    fontSize: 13,
    color: "#333",
  },
  menu: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 6,
    elevation: 4,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  menuItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
