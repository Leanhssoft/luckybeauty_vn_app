import PageEmpty from "@/components/page_empty";
import { TrangThaiLichHen } from "@/enum/TrangThaiLichHen";
import { INhatKyCuocHen } from "@/services/appointment/INhatKyCuocHen";
import { IPagedRequestDto } from "@/services/commonDto/IPagedRequestDto";
import { IPageResultDto } from "@/services/commonDto/IPageResultDto";
import { IKhachHangItemDto } from "@/services/customer/IKhachHangItemDto";
import { ILichSuMuaHang } from "@/services/customer/ILichSuMuaHang";
import KhachHangService from "@/services/customer/KhachHangService";
import CommonFunc from "@/utils/CommonFunc";
import { Avatar, Theme } from "@rneui/base";
import { Text, useTheme } from "@rneui/themed";
import dayjs from "dayjs";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

enum Tab {
  CUOC_HEN = 1,
  NO = 2,
  TGT = 3,
}

export default function CustomerDetails() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tabActive, setTabActive] = useState(Tab.CUOC_HEN);
  const [customerItem, setCustomerItem] = useState<IKhachHangItemDto>();
  const [pageDataNhatKyCuocHen, setPageDataNhatKyCuocHen] = useState<
    IPageResultDto<INhatKyCuocHen>
  >({ items: [], totalCount: 0, totalPage: 0 });
  const [pageDataNhatKyMuaHang, setPageDataNhatKyMuaHang] = useState<
    IPageResultDto<ILichSuMuaHang>
  >({ items: [], totalCount: 0, totalPage: 0 });

  const getInforCustomer_byId = async () => {
    const data = await KhachHangService.getDetail(id);
    setCustomerItem(data);
  };

  const getNhatKyCuocHen = async () => {
    const param: IPagedRequestDto = {
      skipCount: 1,
      maxResultCount: 10,
      keyword: "",
    };
    const data = await KhachHangService.LichSuDatLich(id, param);
    setPageDataNhatKyCuocHen((prev) => {
      return {
        ...prev,
        items: data?.items,
        totalCount: data?.totalCount,
      };
    });
  };
  const getLichSuMuaHang = async () => {
    const param: IPagedRequestDto = {
      skipCount: 1,
      maxResultCount: 10,
      keyword: "",
    };
    const data = await KhachHangService.LichSuMuaHang(id, param);
    const arrConNo = data?.items?.filter((x) => x.conNo > 0);
    setPageDataNhatKyMuaHang((prev) => {
      return {
        ...prev,
        items: arrConNo,
        totalCount: arrConNo?.length,
      };
    });
  };

  useEffect(() => {
    getInforCustomer_byId();
    getNhatKyCuocHen();
    setTabActive(Tab.CUOC_HEN);
  }, [id]);

  const changeTab = async (tabNew: number) => {
    setTabActive(tabNew);
    switch (tabNew) {
      case Tab.CUOC_HEN:
        {
          getNhatKyCuocHen();
        }
        break;
      case Tab.NO:
        {
          getLichSuMuaHang();
        }
        break;
      case Tab.CUOC_HEN:
        {
          getNhatKyCuocHen();
        }
        break;
    }
  };
  return (
    <View style={[styles.container]}>
      <View style={[styles.flexRow, { gap: 8 }]}>
        <Avatar
          rounded
          size={50}
          title={
            CommonFunc.checkNull(customerItem?.avatar ?? "")
              ? CommonFunc.getFirstLetter(customerItem?.tenKhachHang)
              : ""
          }
          containerStyle={{ backgroundColor: theme.colors.greyOutline }}
        />
        <View style={{ gap: 4 }}>
          <Text style={{ fontWeight: 600, fontSize: 20 }}>
            {customerItem?.tenKhachHang}
          </Text>
          <Text style={{ color: theme.colors.grey4 }}>
            {customerItem?.maKhachHang}
          </Text>
        </View>
      </View>
      <View
        style={{
          gap: 16,
          borderBottomColor: theme.colors.grey5,
          borderBottomWidth: 1,
          paddingVertical: 24,
        }}
      >
        <View style={[styles.flexRow, { justifyContent: "space-between" }]}>
          <Text>Điện thoại</Text>
          <Text> {customerItem?.soDienThoai}</Text>
        </View>
        <View style={[styles.flexRow, { justifyContent: "space-between" }]}>
          <Text>Ngày sinh</Text>
          <Text>
            {dayjs(customerItem?.ngaySinh ?? new Date()).format("DD/MM/YYYY")}
          </Text>
        </View>
        <View style={[styles.flexRow, { justifyContent: "space-between" }]}>
          <Text>Địa chỉ</Text>
          <Text> {customerItem?.diaChi}</Text>
        </View>
        <View style={[styles.flexRow, { justifyContent: "space-between" }]}>
          <Text>Nhóm khách</Text>
          <Text> {customerItem?.tenNhomKhach ?? "Nhóm mặc định"}</Text>
        </View>
      </View>
      <View
        style={[
          styles.flexRow,

          {
            justifyContent: "space-between",
            paddingVertical: 24,
            borderBottomColor: theme.colors.grey5,
            borderBottomWidth: 1,
          },
        ]}
      >
        <TouchableOpacity
          style={{ gap: 8, alignItems: "center" }}
          onPress={() => changeTab(Tab.CUOC_HEN)}
        >
          <Text
            style={[
              styles.number,
              {
                color:
                  tabActive === Tab.CUOC_HEN
                    ? theme.colors.primary
                    : theme.colors.black,
              },
            ]}
          >
            {CommonFunc.formatCurrency(customerItem?.soLanBooking ?? 0)}
          </Text>
          <Text
            style={{
              color:
                tabActive === Tab.CUOC_HEN
                  ? theme.colors.primary
                  : theme.colors.black,
            }}
          >
            Cuộc hẹn
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ gap: 8, alignItems: "center" }}
          onPress={() => changeTab(Tab.NO)}
        >
          <Text
            style={[
              styles.number,
              {
                color:
                  tabActive === Tab.NO
                    ? theme.colors.primary
                    : theme.colors.black,
              },
            ]}
          >
            {CommonFunc.formatCurrency(customerItem?.conNo ?? 0)}
          </Text>
          <Text
            style={{
              color:
                tabActive === Tab.NO
                  ? theme.colors.primary
                  : theme.colors.black,
            }}
          >
            Còn nợ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ gap: 8, alignItems: "center" }}
          onPress={() => changeTab(Tab.TGT)}
        >
          <Text
            style={[
              styles.number,
              {
                color:
                  tabActive === Tab.TGT
                    ? theme.colors.primary
                    : theme.colors.black,
              },
            ]}
          >
            {CommonFunc.formatCurrency(customerItem?.soDuTheGiaTri ?? 0)}
          </Text>
          <Text
            style={{
              color:
                tabActive === Tab.TGT
                  ? theme.colors.primary
                  : theme.colors.black,
            }}
          >
            Số sư thẻ
          </Text>
        </TouchableOpacity>
      </View>
      {tabActive === Tab.CUOC_HEN && (
        <View style={{ marginTop: 18 }}>
          <Text style={{ textDecorationLine: "underline" }}></Text>
          <View style={{ marginTop: 0 }}>
            {(pageDataNhatKyCuocHen?.totalCount ?? 0) == 0 ? (
              <PageEmpty txt="Không có dữ liệu để hiển thị" />
            ) : (
              <View style={{ gap: 12 }}>
                {pageDataNhatKyCuocHen?.items?.map((x, index) => (
                  <View
                    key={index}
                    style={[
                      styles.flexRow,
                      { justifyContent: "space-between" },
                    ]}
                  >
                    <View style={{ gap: 4 }}>
                      <Text style={{ fontWeight: 600 }}>{x.tenHangHoa}</Text>
                      <View style={[styles.flexRow, { gap: 16 }]}>
                        <Text style={{ color: theme.colors.grey4 }}>
                          {dayjs(x.bookingDate).format("DD/MM/YYYY")}
                        </Text>
                        <Text style={{ color: theme.colors.grey4 }}>
                          {dayjs(x.bookingDate).format("HH:mm")}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        color:
                          x.trangThai === TrangThaiLichHen.DAT_LICH
                            ? theme.colors.softOrange
                            : x.trangThai === TrangThaiLichHen.DA_XAC_NHAN
                            ? theme.colors.softBlue
                            : x.trangThai === TrangThaiLichHen.CHECK_IN
                            ? theme.colors.softTeal
                            : theme.colors.black,
                      }}
                    >
                      {x.txtTrangThai}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      )}
      {tabActive === Tab.NO && (
        <View style={{ marginTop: 18 }}>
          <Text style={{ textDecorationLine: "underline" }}></Text>
          <View style={{ marginTop: 0 }}>
            {(pageDataNhatKyMuaHang?.totalCount ?? 0) == 0 ? (
              <PageEmpty txt="Không có dữ liệu để hiển thị" />
            ) : (
              <View style={{ gap: 16 }}>
                {pageDataNhatKyMuaHang?.items?.map((x, index) => (
                  <View
                    key={index}
                    style={[
                      styles.flexRow,
                      { justifyContent: "space-between" },
                    ]}
                  >
                    <View style={{ gap: 4 }}>
                      <Text>{x.maHoaDon}</Text>
                      <Text style={{ color: theme.colors.grey4 }}>
                        {dayjs(x.ngayLapHoaDon).format("DD/MM/YYYY HH:mm")}
                      </Text>
                    </View>
                    <View style={{ gap: 4, alignItems: "center" }}>
                      <Text style={[styles.number]}>
                        {CommonFunc.formatCurrency(x.tongTienHang)}
                      </Text>
                      <View style={[styles.flexRow, { gap: 4 }]}>
                        <Text>Nợ:</Text>
                        <Text style={{ color: theme.colors.error }}>
                          {CommonFunc.formatCurrency(x.conNo)}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    flexRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    number: {
      fontSize: 16,
      fontWeight: 600,
    },
  });
