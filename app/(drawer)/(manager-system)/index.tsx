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
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          <TouchableOpacity style={styles.card}>
            <Icon name="account-group" type={IconType.MATERIAL_COMMUNITY} />
            <Text>Nhóm người dùng</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card}>
            <Icon name="person-circle-outline" type={IconType.IONICON} />
            <Text>Người dùng</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card}>
            <Icon name="cloud-outline" type={IconType.IONICON} />
            <Text>Tenant</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card}>
            <Icon name="color-filter-outline" type={IconType.IONICON} />
            <Text>Brandname SMS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    card: {
      width: "48%",
      aspectRatio: 1, // giúp width = height, tự động vuông
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      // marginBottom: 10,
      padding: 8,
      alignItems: "center",
    },
  });
