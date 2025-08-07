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
  //   components: {
  //     Button: {
  //       raised: true,
  //     },
  //   },
});
