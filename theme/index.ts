import { createTheme } from "@rneui/themed";
import {
  customTitleColors,
  darkBackground,
  lightBackground,
} from "./customerColors";

export const theme = createTheme({
  lightColors: {
    ...customTitleColors,
    ...lightBackground,
  },
  darkColors: {
    ...customTitleColors,
    ...darkBackground,
  },
  components: {
    Button: {
      titleStyle: { fontSize: 16 },
    },
    SearchBar: {
      inputStyle: {
        fontSize: 14,
      },
      containerStyle: {
        borderTopWidth: 0,
        paddingVertical: 0,
        paddingHorizontal: 16,
      },
    },
    Input: {
      inputStyle: {
        fontSize: 14,
      },
    },
  },
});
