import { IconType } from "@/enum/IconType";
import { Theme } from "@rneui/base";
import { Icon, Text, useTheme } from "@rneui/themed";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ManagerSystemMenu() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const insest = useSafeAreaInsets();
  const route = useRouter();

  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        style={styles.tabs}
        onPress={() =>
          route.navigate("/(drawer)/(manager-system)/(role-permission)/role")
        }
      >
        <View style={styles.boxLeft}>
          <Icon name="account-group" type={IconType.MATERIAL_COMMUNITY} />
          <Text>Quyền & vai trò</Text>
        </View>
        <Icon name="chevron-forward" type={IconType.IONICON} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabs}
        onPress={() => route.navigate("/(drawer)/(manager-system)/user")}
      >
        <View style={styles.boxLeft}>
          <Icon name="person-circle-outline" type={IconType.IONICON} />
          <Text>Người dùng</Text>
        </View>
        <Icon name="chevron-forward" type={IconType.IONICON} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabs}>
        <View style={styles.boxLeft}>
          <Icon name="cloud-outline" type={IconType.IONICON} />
          <Text>Tenant</Text>
        </View>
        <Icon name="chevron-forward" type={IconType.IONICON} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabs}>
        <View style={styles.boxLeft}>
          <Icon name="color-filter-outline" type={IconType.IONICON} />
          <Text>Brandname SMS</Text>
        </View>
        <Icon name="chevron-forward" type={IconType.IONICON} />
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    tabs: {
      borderBottomWidth: 1,
      borderColor: theme.colors.primary,
      padding: 16,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    boxLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
  });
