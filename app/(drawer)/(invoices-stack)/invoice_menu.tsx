import { Theme } from "@rneui/base";
import { Card, Text, useTheme } from "@rneui/themed";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function InvoiceMenu() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const insest = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingBottom: insest.bottom + 16 }]}>
      <TouchableOpacity style={{ flex: 1 }}>
        <Card containerStyle={styles.card}>
          <Card.Title style={styles.title}>Hóa đơn bán lẻ (8)</Card.Title>
          <Card.Divider />
          <View
            style={{
              alignItems: "center",
              gap: 16,
              paddingVertical: 12,
            }}
          >
            <Text>
              Tổng bán:{" "}
              <Text style={{ fontSize: 16, fontWeight: 600 }}>80.000.0000</Text>
            </Text>
            {/* <Text> Đã thanh toán: 80.000.0000</Text> */}
            <Text>
              {" "}
              Còn nợ: <Text style={{ color: "red" }}>1.500.000</Text>
            </Text>
          </View>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity style={{ flex: 1 }}>
        <Card containerStyle={styles.card}>
          <Card.Title style={styles.title}>Gói dịch vụ</Card.Title>
          <Card.Divider />
          <Text> 50.000.000</Text>
        </Card>
      </TouchableOpacity>

      <TouchableOpacity style={{ flex: 1 }}>
        <Card containerStyle={styles.card}>
          <Card.Title style={styles.title}>Thẻ giá trị</Card.Title>
          <Card.Divider />
          <Text> 50.000.000</Text>
        </Card>
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
      flex: 1,
      borderRadius: 8,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    title: {
      fontSize: 18,
      fontWeight: 600,
    },
  });
