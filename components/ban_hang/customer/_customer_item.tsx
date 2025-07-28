import { IKhachHangItemDto } from "@/services/customer/IKhachHangItemDto";
import CommonFunc from "@/utils/CommonFunc";
import { Avatar, Text } from "@rneui/base";
import { Pressable, StyleSheet, View } from "react-native";

type PropCustomerItem = {
  item: IKhachHangItemDto;
  choseCustomer: (item: IKhachHangItemDto) => void;
};

export const CustomerItem = ({ item, choseCustomer }: PropCustomerItem) => {
  return (
    <Pressable
      style={styles.customerContainer}
      key={item.idKhachHang}
      onPress={() => choseCustomer(item)}
    >
      <Avatar
        rounded
        title={CommonFunc.getFirstLetter(item?.tenKhachHang ?? "")}
        size="medium"
        containerStyle={styles.avatarContainer}
        titleStyle={{
          fontWeight: 500,
        }}
      />
      <View style={styles.infoContainer}>
        <View style={{ gap: 12 }}>
          <Text
            style={{
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            {item?.tenKhachHang}
          </Text>
          <Text>{item.soDienThoai}</Text>
        </View>
        <View style={{ gap: 12 }}>
          <Text
            style={{
              fontWeight: 500,
            }}
          >
            Điểm: {item?.tongTichDiem ?? 0}{" "}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  customerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 80,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 60,
    backgroundColor: "#ccc",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 16,
    flex: 1,
  },
});
