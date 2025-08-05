import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

type Variant = "standard" | "outlined";

interface TextFieldCustomProps extends TextInputProps {
  label?: string;
  helperText?: string;
  error?: boolean;
  variant?: Variant;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const TextFieldCustom: React.FC<TextFieldCustomProps> = ({
  label,
  helperText,
  error = false,
  variant = "standard",
  containerStyle,
  inputStyle,
  startIcon,
  endIcon,
  style,
  ...rest
}) => {
  const borderStyles: ViewStyle =
    variant === "outlined"
      ? {
          borderWidth: 1,
          borderColor: error ? "#f44336" : "#ccc",
          borderRadius: 4,
        }
      : {
          borderBottomWidth: 1,
          borderBottomColor: error ? "#f44336" : "#ccc",
        };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={[styles.label]}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          borderStyles,
          error && { borderColor: "#f44336" },
        ]}
      >
        {startIcon && <View style={styles.icon}>{startIcon}</View>}
        <TextInput
          style={[
            styles.input,
            inputStyle,
            ...(startIcon ? [{ paddingLeft: 0 }] : []),
            ...(endIcon ? [{ paddingRight: 0 }] : []),
          ]}
          placeholderTextColor="#999"
          {...rest}
        />
        {endIcon && <View style={styles.icon}>{endIcon}</View>}
      </View>
      {helperText && (
        <Text style={[styles.helperText, error && { color: "#f44336" }]}>
          {helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 8,
    color: "#000",
  },
  icon: {
    paddingHorizontal: 4,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    color: "#666",
  },
});
