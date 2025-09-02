import { BackDropView } from "@/components/back_drop_view";
import { InvoiceStatus } from "@/enum/InvoiceStatus";
import { IHoaDonChiTietDto } from "@/services/hoadon/dto";
import { PropModal } from "@/type/PropModal";
import { Icon, Theme } from "@rneui/base";
import { useTheme } from "@rneui/themed";
import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ModalAddGioHang({
  isShow,
  objUpdate,
  onClose,
  onSave,
}: PropModal<IHoaDonChiTietDto>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const insest = useSafeAreaInsets();
  const [ctDoing, setCTDoing] = useState<IHoaDonChiTietDto>(
    {} as IHoaDonChiTietDto
  );

  useEffect(() => {
    if (isShow) {
      setCTDoing({
        ...ctDoing,
        id: objUpdate?.id ?? "",
        stt: objUpdate?.stt ?? 1,
        maHangHoa: objUpdate?.maHangHoa ?? "",
        tenHangHoa: objUpdate?.tenHangHoa ?? "",
        idDonViQuyDoi: objUpdate?.idDonViQuyDoi ?? "",
        idHangHoa: objUpdate?.idHangHoa ?? "",
        idHoaDon: objUpdate?.idHoaDon ?? "",
        soLuong: objUpdate?.soLuong ?? 0,
        ptChietKhau: objUpdate?.ptChietKhau ?? 0,
        tienChietKhau: objUpdate?.tienChietKhau ?? 0,
        ptThue: objUpdate?.ptThue ?? 0,
        tienThue: objUpdate?.tienThue ?? 0,
        donGiaTruocCK: objUpdate?.donGiaTruocCK ?? 0,
        donGiaSauCK: objUpdate?.donGiaSauCK ?? 0,
        donGiaSauVAT: objUpdate?.donGiaSauVAT ?? 0,
        thanhTienTruocCK: objUpdate?.thanhTienTruocCK ?? 0,
        thanhTienSauCK: objUpdate?.thanhTienSauCK ?? 0,
        thanhTienSauVAT: objUpdate?.thanhTienSauVAT ?? 0,
        ghiChu: objUpdate?.ghiChu ?? "",
        trangThai: objUpdate?.trangThai ?? InvoiceStatus.HOAN_THANH,
      });
    }
  }, [isShow]);

  const PageLoad = async () => {};

  const tangSoLuong = () => {
    const slNew = ctDoing.soLuong + 1;
    setCTDoing({
      ...ctDoing,
      soLuong: slNew,
      thanhTienTruocCK: slNew * (ctDoing?.donGiaTruocCK ?? 0),
      thanhTienSauCK: slNew * (ctDoing?.donGiaSauCK ?? 0),
      thanhTienSauVAT: slNew * (ctDoing?.donGiaSauVAT ?? 0),
    });
  };

  const giamSoLuong = () => {
    let slNew = ctDoing.soLuong;
    if (slNew > 0) {
      slNew = slNew - 1;
    }
    const thanhtien = slNew * (ctDoing?.donGiaTruocCK ?? 0);
    setCTDoing({
      ...ctDoing,
      soLuong: slNew,
      thanhTienTruocCK: thanhtien,
      thanhTienSauCK: thanhtien,
      thanhTienSauVAT: thanhtien,
    });
  };

  const agreeGioHang = async () => {
    onSave(ctDoing);
  };

  return (
    <Modal
      visible={isShow}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <BackDropView>
        <View style={[styles.modalView, { marginTop: insest.top }]}>
          <Pressable
            onPress={onClose}
            style={{
              position: "absolute",
              right: 10,
              top: 10,
            }}
          >
            <Icon name="close" size={24} color={theme.colors.grey4} />
          </Pressable>
          <View
            style={{
              gap: 16,
              alignItems: "center",
            }}
          >
            <Text style={styles.productName}>{ctDoing?.tenHangHoa}</Text>
            <Text style={styles.productPrice}>
              {new Intl.NumberFormat("vi-VN").format(
                ctDoing?.donGiaTruocCK ?? 0
              )}
            </Text>

            <View
              style={{
                gap: 24,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  textAlign: "left",
                }}
              >
                Số lượng
              </Text>
              <Icon
                name="remove-circle-outline"
                size={30}
                color={"#ccc"}
                onPress={giamSoLuong}
              />
              <Text
                style={[
                  styles.productPrice,
                  {
                    textAlign: "center",
                  },
                ]}
              >
                {ctDoing.soLuong}
              </Text>
              <Icon
                name="add-circle-outline"
                size={30}
                color={theme.colors.greyOutline}
                onPress={tangSoLuong}
              />
            </View>
          </View>
          <View
            style={{
              marginTop: 20,
              borderTopColor: theme.colors.greyOutline,
              borderTopWidth: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <Text style={[styles.productPrice]}>Thành tiền</Text>
              <Text style={[styles.productName]}>
                {new Intl.NumberFormat("vi-VN").format(
                  ctDoing?.thanhTienSauCK ?? 0
                )}
              </Text>
            </View>
            <Pressable
              style={[styles.button, styles.buttonOpen]}
              onPress={agreeGioHang}
            >
              <Text style={{ color: theme.colors.white }}>
                Thêm vào giỏ hàng
              </Text>
            </Pressable>
          </View>
        </View>
      </BackDropView>
    </Modal>
  );
}
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    modalView: {
      borderRadius: 12,
      padding: 30,
      width: "98%",
      shadowColor: "#000", // màu bóng
      shadowOffset: {
        // độ lệch của bóng
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25, // độ mờ
      shadowRadius: 4, // bán kính mờ
      elevation: 5,
      backgroundColor: theme.colors.white,
    },
    productName: {
      fontSize: 16,
      fontWeight: "600",
    },
    productPrice: {
      fontSize: 14,
      fontWeight: "500",
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      alignItems: "center",
    },
    buttonOpen: {
      backgroundColor: theme.colors.primary,
      marginTop: 16,
    },
  });
