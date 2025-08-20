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
    background: "#ffff",
  },
  darkColors: {
    ...customTitleColors,
    ...darkBackground,
  },
  components: {
    Button: {
      titleStyle: { fontSize: 12 },
    },
    Text: {
      style: {
        fontSize: 11,
      },
    },
    SearchBar: {
      inputStyle: {
        fontSize: 11,
      },
      containerStyle: {
        borderTopWidth: 0,
        paddingVertical: 0,
        paddingHorizontal: 16,
      },
    },
    Input: {
      inputStyle: {
        fontSize: 11,
      },
    },
  },
});
