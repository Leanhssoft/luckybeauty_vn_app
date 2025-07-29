import { Theme } from "@rneui/base";
import { Text, useTheme } from "@rneui/themed";
import { StyleSheet, TextStyle, TouchableOpacity } from "react-native";

type TextLinkProps = {
  lable: string;
  overrideStyles?: TextStyle;
  onPress: () => void;
};
export const TextLink = ({ lable, overrideStyles, onPress }: TextLinkProps) => {
  const { theme } = useTheme();

  const defaultStyle = createStyle(theme);
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[defaultStyle.text, overrideStyles]}>{lable}</Text>
    </TouchableOpacity>
  );
};

const createStyle = (theme: Theme) =>
  StyleSheet.create({
    text: {
      textDecorationLine: "underline",
      color: theme.colors.primary,
    },
  });
