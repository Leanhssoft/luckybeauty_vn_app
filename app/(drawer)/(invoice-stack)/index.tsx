import { IconType } from "@/enum/IconType";
import { LoaiChungTu } from "@/enum/LoaiChungTu";
import HoaDonService from "@/services/hoadon/HoaDonService";
import { IParamSearchHoaDondto } from "@/services/hoadon/IParamSearchHoaDondto";
import { useAppContext } from "@/store/react_context/AppProvider";
import CommonFunc from "@/utils/CommonFunc";
import { Theme } from "@rneui/base";
import { Icon, Text, useTheme } from "@rneui/themed";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function InvoiceMenu() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const insest = useSafeAreaInsets();
  const route = useRouter();
  const { chiNhanhCurrent } = useAppContext();
  const idChiNhanh = chiNhanhCurrent?.id ?? "";
  const [soHDLe, setSoHDLe] = useState(0);
  const [doanhThu_HDLe, setDoanhThu_HDLe] = useState(0);
  const [conNo_HDLe, setConNo_HDLe] = useState(0);
  const [soGDV, setSoGDV] = useState(0);
  const [doanhThu_GDV, setDoanhThu_GDV] = useState(0);
  const [conNo_GDV, setConNo_GDV] = useState(0);
  const [soTGT, setSoTGT] = useState(0);
  const [doanhThu_TGT, setDoanhThu_TGT] = useState(0);
  const [conNo_TGT, setConNo_TGT] = useState(0);

  const GetDoanhThu_byLoaiChungTu = useCallback(async () => {
    const param: IParamSearchHoaDondto = {
      idChiNhanhs: [idChiNhanh],
      fromDate: dayjs().startOf("month").format("YYYY-MM-DD"),
      toDate: dayjs().add(1, "day").format("YYYY-MM-DD"),
      idLoaiChungTus: [
        LoaiChungTu.HOA_DON_BAN_LE,
        LoaiChungTu.GOI_DICH_VU,
        LoaiChungTu.THE_GIA_TRI,
      ],
    };
    const data = await HoaDonService.GetDoanhThu_byLoaiChungTu(param);

    const hdLe = data?.filter(
      (x) => x.idLoaiChungTu === LoaiChungTu.HOA_DON_BAN_LE
    );
    if ((hdLe?.length ?? 0) > 0) {
      setSoHDLe(hdLe[0].soHoaDon);
      setDoanhThu_HDLe(hdLe[0].doanhThu);
      setConNo_HDLe(hdLe[0].conNo);
    } else {
      setSoHDLe(0);
      setDoanhThu_HDLe(0);
      setConNo_HDLe(0);
    }
    const gdv = data?.filter(
      (x) => x.idLoaiChungTu === LoaiChungTu.GOI_DICH_VU
    );
    if ((gdv?.length ?? 0) > 0) {
      setSoGDV(gdv[0].soHoaDon);
      setDoanhThu_GDV(gdv[0].doanhThu);
      setConNo_GDV(gdv[0].conNo);
    } else {
      setSoGDV(0);
      setDoanhThu_GDV(0);
      setConNo_GDV(0);
    }
    const tgt = data?.filter(
      (x) => x.idLoaiChungTu === LoaiChungTu.THE_GIA_TRI
    );
    if ((tgt?.length ?? 0) > 0) {
      setSoTGT(tgt[0].soHoaDon);
      setDoanhThu_TGT(tgt[0].doanhThu);
      setConNo_TGT(tgt[0].conNo);
    } else {
      setSoTGT(0);
      setDoanhThu_TGT(0);
      setConNo_TGT(0);
    }
  }, [idChiNhanh]);

  useEffect(() => {
    GetDoanhThu_byLoaiChungTu();
  }, [GetDoanhThu_byLoaiChungTu]);

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
                    <Text style={styles.title}>
                      {CommonFunc.formatCurrency(doanhThu_HDLe)}
                    </Text>
                  </View>
                  <View>
                    <Text>Còn nợ</Text>
                    <Text style={styles.title}>
                      {CommonFunc.formatCurrency(conNo_HDLe)}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text>Số hóa đơn</Text>
                <Text style={styles.title}>
                  {CommonFunc.formatCurrency(soHDLe)}
                </Text>
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
                    <Text style={styles.title}>
                      {CommonFunc.formatCurrency(doanhThu_GDV)}
                    </Text>
                  </View>
                  <View>
                    <Text>Còn nợ</Text>
                    <Text style={styles.title}>
                      {CommonFunc.formatCurrency(conNo_GDV)}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text>Số hóa đơn</Text>
                <Text style={styles.title}>
                  {CommonFunc.formatCurrency(soGDV)}
                </Text>
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
                    <Text style={styles.title}>
                      {CommonFunc.formatCurrency(doanhThu_TGT)}
                    </Text>
                  </View>
                  <View>
                    <Text>Còn nợ</Text>
                    <Text style={styles.title}>
                      {CommonFunc.formatCurrency(conNo_TGT)}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text>Số hóa đơn</Text>
                <Text style={styles.title}>
                  {CommonFunc.formatCurrency(soTGT)}
                </Text>
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
