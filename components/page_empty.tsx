import { Text } from "@rneui/base";
import { Icon } from "@rneui/themed";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { IconType } from "../enum/IconType";

interface PropsPageEmpty {
  txt: string;
  showIconAdd?: boolean;
  style?: StyleProp<ViewStyle>; // Kiểu style nhận vào
}

const PageEmpty = ({ txt, showIconAdd, style }: PropsPageEmpty) => {
  return (
    <View style={[styles.container, style]}>
      {/* <Icon type={IconType.FOUNDATION} name="page-add" size={20} /> */}
      <Text
        style={{
          textAlign: "center",
        }}
      >
        {txt}
      </Text>
      {showIconAdd && (
        <Icon
          type={IconType.IONICON}
          name="add-circle-outline"
          size={50}
          containerStyle={{
            position: "absolute",
            bottom: 10,
            right: 10,
          }}
          iconStyle={{
            color: "#FA6800",
          }}
        />
      )}
    </View>
  );
};

export default PageEmpty;

const styles = StyleSheet.create({
  container: {
    gap: 12,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    position: "relative",
  },
});
