import { TextLink } from "@/components/_text_link";
import ModalAddCustomer from "@/components/customer/modal_add_customer";
import PageEmpty from "@/components/page_empty";
import { TrangThaiLichHen } from "@/enum/TrangThaiLichHen";
import { INhatKyCuocHen } from "@/services/appointment/INhatKyCuocHen";
import { IPagedRequestDto } from "@/services/commonDto/IPagedRequestDto";
import { IPageResultDto } from "@/services/commonDto/IPageResultDto";
import { ICreateOrEditKhachHangDto } from "@/services/customer/ICreateOrEditKhachHangDto";
import { IKhachHangItemDto } from "@/services/customer/IKhachHangItemDto";
import { ILichSuMuaHang } from "@/services/customer/ILichSuMuaHang";
import { ILuyKeTheGiaTri } from "@/services/customer/ILuyKeTheGiaTri";
import KhachHangService from "@/services/customer/KhachHangService";
import { useKhachHangStore } from "@/store/zustand/khach_hang";
import CommonFunc from "@/utils/CommonFunc";
import { Avatar, Theme } from "@rneui/base";
import { Text, useTheme } from "@rneui/themed";
import dayjs from "dayjs";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
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
  const navigation = useNavigation();
  const updateCustomer = useKhachHangStore((o) => o.setCustomer);
  const [isShowModalCustomer, setIsShowModalCustomer] = useState(false);
  const [tabActive, setTabActive] = useState(Tab.CUOC_HEN);
  const [customerItem, setCustomerItem] = useState<IKhachHangItemDto>({
    id: "",
    idKhachHang: "",
    maKhachHang: "",
    tenKhachHang: "",
    soDienThoai: "",
  });
  const [listLuyKeTGT, setListLuyKeTGT] = useState<ILuyKeTheGiaTri[]>([]);
  const [pageDataNhatKyCuocHen, setPageDataNhatKyCuocHen] = useState<
    IPageResultDto<INhatKyCuocHen>
  >({ items: [], totalCount: 0, totalPage: 0 });
  const [pageDataNhatKyMuaHang, setPageDataNhatKyMuaHang] = useState<
    IPageResultDto<ILichSuMuaHang>
  >({ items: [], totalCount: 0, totalPage: 0 });

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TextLink lable="Sửa" onPress={showModalEditCustomer} />
      ),
    });
  }, [navigation]);

  const showModalEditCustomer = () => {
    setIsShowModalCustomer(true);
  };

  const getInforCustomer_byId = async () => {
    const data = await KhachHangService.getDetail(id);
    setCustomerItem(data);
  };

  const GetListLuyKeTGT_ofKhachHang = async () => {
    const data = await KhachHangService.GetListLuyKeTGT_ofKhachHang(id);
    setListLuyKeTGT(data);
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
        totalCount: data?.totalCount ?? 0,
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
      case Tab.TGT:
        {
          GetListLuyKeTGT_ofKhachHang();
        }
        break;
    }
  };

  const saveOKCustomer = (item: ICreateOrEditKhachHangDto) => {
    setIsShowModalCustomer(false);
    setCustomerItem((prev) => {
      return {
        ...prev,
        maKhachHang: item?.maKhachHang,
        tenKhachHang: item?.tenKhachHang,
        soDienThoai: item?.soDienThoai,
        diaChi: item?.diaChi,
        ngaySinh: item?.ngaySinh,
        idNhomKhach: item?.idNhomKhach ?? "",
        tenNhomKhach: item?.tenNhomKhach ?? "",
      };
    });

    updateCustomer(item);
  };

  return (
    <View style={[styles.container]}>
      <ModalAddCustomer
        isShow={isShowModalCustomer}
        objUpdate={customerItem}
        onClose={() => setIsShowModalCustomer(false)}
        onSave={saveOKCustomer}
      />
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
            {!customerItem?.ngaySinh
              ? ""
              : dayjs(customerItem?.ngaySinh ?? new Date()).format(
                  "DD/MM/YYYY"
                )}
          </Text>
        </View>
        <View style={[styles.flexRow, { justifyContent: "space-between" }]}>
          <Text>Địa chỉ</Text>
          <Text> {customerItem?.diaChi}</Text>
        </View>
        <View style={[styles.flexRow, { justifyContent: "space-between" }]}>
          <Text>Nhóm khách</Text>
          <Text>
            {CommonFunc.checkNull(customerItem?.tenNhomKhach ?? "")
              ? "Nhóm mặc định"
              : customerItem?.tenNhomKhach}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.flexRow,

          {
            gap: 16,
            paddingVertical: 24,
            borderBottomColor: theme.colors.grey5,
            borderBottomWidth: 1,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.boxNumber,
            tabActive === Tab.CUOC_HEN ? styles.boxActive : styles.boxNotActive,
          ]}
          onPress={() => changeTab(Tab.CUOC_HEN)}
        >
          <Text
            style={[
              styles.number,
              tabActive === Tab.CUOC_HEN
                ? styles.textActive
                : styles.textNotActive,
            ]}
          >
            {CommonFunc.formatCurrency(customerItem?.soLanBooking ?? 0)}
          </Text>
          <Text
            style={[
              tabActive === Tab.CUOC_HEN
                ? styles.textActive
                : styles.textNotActive,
            ]}
          >
            Cuộc hẹn
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.boxNumber,
            tabActive === Tab.NO ? styles.boxActive : styles.boxNotActive,
          ]}
          onPress={() => changeTab(Tab.NO)}
        >
          <Text
            style={[
              styles.number,
              tabActive === Tab.NO ? styles.textActive : styles.textNotActive,
            ]}
          >
            {CommonFunc.formatCurrency(customerItem?.conNo ?? 0)}
          </Text>
          <Text
            style={[
              tabActive === Tab.NO ? styles.textActive : styles.textNotActive,
            ]}
          >
            Còn nợ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.boxNumber,
            tabActive === Tab.TGT ? styles.boxActive : styles.boxNotActive,
          ]}
          onPress={() => changeTab(Tab.TGT)}
        >
          <Text
            style={[
              styles.number,
              tabActive === Tab.TGT ? styles.textActive : styles.textNotActive,
            ]}
          >
            {CommonFunc.formatCurrency(customerItem?.soDuTheGiaTri ?? 0)}
          </Text>
          <Text
            style={[
              tabActive === Tab.TGT ? styles.textActive : styles.textNotActive,
            ]}
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
              <PageEmpty
                txt=" Không có dữ liệu để hiển thị"
                style={{ height: 80 }}
              />
            ) : (
              <ScrollView style={{ gap: 12 }}>
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
              </ScrollView>
            )}
          </View>
        </View>
      )}
      {tabActive === Tab.NO && (
        <View style={{ marginTop: 18 }}>
          <Text style={{ textDecorationLine: "underline" }}></Text>
          <View style={{ marginTop: 0 }}>
            {(pageDataNhatKyMuaHang?.totalCount ?? 0) == 0 ? (
              <PageEmpty
                txt="Không có dữ liệu để hiển thị"
                style={{ height: 80 }}
              />
            ) : (
              <ScrollView style={{ gap: 16 }}>
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
              </ScrollView>
            )}
          </View>
        </View>
      )}
      {tabActive === Tab.TGT && (
        <View style={{ marginTop: 18 }}>
          <Text style={{ textDecorationLine: "underline" }}></Text>
          <View style={{ marginTop: 0 }}>
            {(listLuyKeTGT?.length ?? 0) == 0 ? (
              <PageEmpty
                txt="Không có dữ liệu để hiển thị"
                style={{ height: 80 }}
              />
            ) : (
              <ScrollView style={{ gap: 16 }}>
                {listLuyKeTGT?.map((x, index) => (
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
                        {dayjs(x.ngayPhatSinh).format("DD/MM/YYYY HH:mm")}
                      </Text>
                    </View>
                    <View style={{ gap: 4, alignItems: "center" }}>
                      <Text style={[styles.number]}>
                        {CommonFunc.formatCurrency(x.giaTriPhatSinh)}
                      </Text>
                      <View style={[styles.flexRow, { gap: 4 }]}>
                        <Text>Lũy kế:</Text>
                        <Text style={{ color: theme.colors.error }}>
                          {CommonFunc.formatCurrency(x.luyKe)}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
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
    boxNumber: {
      alignItems: "center",
      gap: 8,
      borderRadius: 8,
      padding: 12,
      flex: 1,
    },
    boxActive: {
      shadowColor: theme.colors.black,
      shadowOpacity: 0.2,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      backgroundColor: theme.colors.primary,
    },
    boxNotActive: {
      borderColor: theme.colors.grey5,
      borderWidth: 1,
    },
    textActive: {
      color: theme.colors.white,
    },
    textNotActive: {
      color: theme.colors.black,
    },
  });
