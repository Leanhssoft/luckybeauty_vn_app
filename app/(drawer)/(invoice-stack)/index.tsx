import { IconType } from "@/enum/IconType";
import { Theme } from "@rneui/base";
import { Icon, Text, useTheme } from "@rneui/themed";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function InvoiceMenu() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const insest = useSafeAreaInsets();
  const route = useRouter();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: 16,
          paddingHorizontal: 12,
          paddingBottom: insest.bottom + 24,
        },
      ]}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => route.navigate("/invoices")}
      >
        <View style={[styles.card]}>
          <View style={styles.boxTitle}>
            <Icon
              name="document-text-outline"
              type={IconType.IONICON}
              size={50}
              color={theme.colors.primary}
            />
            <Text style={styles.title}>Hóa đơn bán lẻ</Text>
          </View>
          <View style={styles.boxContent}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 2 }}>
                <View style={{ gap: 24 }}>
                  <View>
                    <Text>Doanh thu</Text>
                    <Text style={styles.title}>100.000.00</Text>
                  </View>
                  <View>
                    <Text>Con no</Text>
                    <Text style={styles.title}>100.000</Text>
                  </View>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text>So hoa don</Text>
                <Text style={styles.title}>100</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ flex: 1, marginTop: 24 }}
        onPress={() => route.navigate("/service_package")}
      >
        <View style={[styles.card]}>
          <View style={styles.boxTitle}>
            <Icon
              name="package"
              type={IconType.OCTICON}
              size={50}
              color={theme.colors.primary}
            />
            <Text style={styles.title}>Gói dịch vụ</Text>
          </View>
          <View style={styles.boxContent}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 2 }}>
                <View style={{ gap: 24 }}>
                  <View>
                    <Text>Doanh thu</Text>
                    <Text style={styles.title}>100.000.00</Text>
                  </View>
                  <View>
                    <Text>Con no</Text>
                    <Text style={styles.title}>100.000</Text>
                  </View>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text>So hoa don</Text>
                <Text style={styles.title}>100</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ flex: 1, marginTop: 24 }}
        onPress={() => route.navigate("/value_card")}
      >
        <View style={[styles.card]}>
          <View style={styles.boxTitle}>
            <Icon
              name="card-outline"
              type={IconType.IONICON}
              size={50}
              color={theme.colors.primary}
            />
            <Text style={styles.title}>Thẻ giá trị</Text>
          </View>
          <View style={styles.boxContent}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 2 }}>
                <View style={{ gap: 24 }}>
                  <View>
                    <Text>Doanh thu</Text>
                    <Text style={styles.title}>100.000.00</Text>
                  </View>
                  <View>
                    <Text>Con no</Text>
                    <Text style={styles.title}>100.000</Text>
                  </View>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text>So hoa don</Text>
                <Text style={styles.title}>100</Text>
              </View>
            </View>
          </View>
        </View>
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
    card: {
      borderRadius: 8,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      padding: 16,
      borderWidth: 1,
    },
    boxTitle: { flexDirection: "row", gap: 12, alignItems: "center" },
    boxContent: { gap: 16, marginTop: 24 },
    title: {
      fontSize: 20,
      fontWeight: 700,
    },
    number: {
      fontSize: 18,
      fontWeight: 700,
    },
  });
