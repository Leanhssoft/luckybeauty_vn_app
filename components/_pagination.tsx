import { IconType } from "@/enum/IconType";
import { Theme } from "@rneui/base";
import { Icon, Text, useTheme } from "@rneui/themed";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type PaginationProps = {
  currentPage: number;
};

const Pagination = ({ currentPage }: PaginationProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();

  const arrPage = [1, 2, 3, 4, 5];
  return (
    <View style={[styles.containerOut, { bottom: 0 }]}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon name="arrow-back-ios" type={IconType.MATERIAL} size={16} />
          {arrPage?.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.pageItem,
                currentPage === item ? styles.btnActive : {},
              ]}
            >
              <Text
                style={[
                  styles.text,
                  currentPage === item ? styles.txtActive : {},
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
          <Icon name="navigate-next" type={IconType.MATERIAL} />
        </View>
      </View>
    </View>
  );
};
export default Pagination;
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    containerOut: {
      position: "absolute",
      width: "100%",
    },
    container: {
      justifyContent: "center",
      padding: 16,
      backgroundColor: theme.colors.white,
    },
    pageItem: { padding: 8, width: 40, height: 40 },
    btnActive: {
      backgroundColor: theme.colors.primary,
      borderRadius: 20,
    },
    text: {
      textAlign: "center",
      fontSize: 16,
    },
    txtActive: {
      color: theme.colors.white,
    },
  });
