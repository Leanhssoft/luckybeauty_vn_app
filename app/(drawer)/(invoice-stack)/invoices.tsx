import BottomSheet from "@/components/_bottom_sheet";
import { ConfirmOKCancel } from "@/components/confirm_ok_cancel";
import AppConst from "@/const/AppConst";
import { IconType } from "@/enum/IconType";
import { LoaiChungTu } from "@/enum/LoaiChungTu";
import { IPageResultDto } from "@/services/commonDto/IPageResultDto";
import { IHoaDonDto, IHoaDonDto_FullInfor } from "@/services/hoadon/dto";
import HoaDonService from "@/services/hoadon/HoaDonService";
import { IParamSearchHoaDondto } from "@/services/hoadon/IParamSearchHoaDondto";
import { useAppContext } from "@/store/react_context/AppProvider";
import { IPropsSimpleDialog } from "@/type/IPropsSimpleDialog";
import CommonFunc from "@/utils/CommonFunc";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Theme } from "@rneui/base";
import { Button, Icon, SearchBar, Text, useTheme } from "@rneui/themed";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { FlatList, RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import Reanimated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Invoices() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const { chiNhanhCurrent } = useAppContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [textSearch, setTextSearch] = useState("");

  const isShowBoxFilter = useSharedValue(false);
  const [isShowBoxSearch, setIsShowBoxSearch] = useState(false);
  const [objSimpleDialog, setObjSimpleDialog] = useState<IPropsSimpleDialog>();
  const [invoiceItemChosed, setInvoiceItemChosed] = useState<IHoaDonDto>();
  const [paramSearchHoaDon, setParamSearchHoaDon] =
    useState<IParamSearchHoaDondto>({
      textSearch: "",
      idLoaiChungTu: LoaiChungTu.HOA_DON_BAN_LE,
      currentPage: currentPage,
      pageSize: AppConst.PAGE_SIZE,
      idChiNhanhs: [chiNhanhCurrent?.id ?? ""],
      fromDate: dayjs().startOf("month").format("YYYY-MM-DD"),
      toDate: dayjs().endOf("month").add(1, "day").format("YYYY-MM-DD"),
      columnSort: "ngayLapHoaDon",
      typeSort: "desc",
    });

  const [pageDataHoaDon, setPageDataHoaDon] = useState<
    IPageResultDto<IHoaDonDto>
  >({ items: [], totalCount: 0, totalPage: 0 });

  const getListHoaDon = async (currentPage: number) => {
    const param: IParamSearchHoaDondto = {
      textSearch: "",
      idLoaiChungTu: LoaiChungTu.HOA_DON_BAN_LE,
      currentPage: currentPage,
      pageSize: AppConst.PAGE_SIZE,
      idChiNhanhs: [chiNhanhCurrent?.id ?? ""],
      fromDate: dayjs().startOf("month").format("YYYY-MM-DD"),
      toDate: dayjs().endOf("month").add(1, "day").format("YYYY-MM-DD"),
      columnSort: "ngayLapHoaDon",
      typeSort: "desc",
    };
    const data = await HoaDonService.GetListHoaDon(param);
    const dataNew = data?.items ?? [];

    if (currentPage === 1) {
      setPageDataHoaDon({
        items: dataNew,
        totalCount: data?.totalCount ?? 0,
        totalPage: Math.ceil((data?.totalCount ?? 0) / AppConst.PAGE_SIZE),
      });
    } else {
      setPageDataHoaDon({
        items: [...(pageDataHoaDon?.items ?? []), ...dataNew],
        totalCount: pageDataHoaDon?.totalCount ?? 0,
        totalPage: Math.ceil(
          (pageDataHoaDon?.totalCount ?? 0) / AppConst.PAGE_SIZE
        ),
      });
    }
  };

  useEffect(() => {
    getListHoaDon(currentPage);
  }, [currentPage]);

  const handleLoadMore = () => {
    setCurrentPage(() => currentPage + 1);
  };

  const deleleInvoice = async () => {
    HoaDonService.DeleteHoaDon(invoiceItemChosed?.id ?? "");
  };

  const showConfirmDelete = () => {
    setObjSimpleDialog({
      ...objSimpleDialog,
      isShow: true,
      mes: `Bạn có chắc chắn muốn xóa hóa đơn ${invoiceItemChosed?.maHoaDon} không?`,
    });
  };

  const gotoInvoiceDetails = () => {};

  function RightAction(
    progress: SharedValue<number>,
    drag: SharedValue<number>
  ) {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: progress.value }], // ví dụ
      };
    }, []); // 👈 dependency array cố định

    return (
      <Reanimated.View style={styleAnimation}>
        <Button
          title="Xóa"
          onPress={showConfirmDelete}
          icon={{ name: "delete", color: "white" }}
          buttonStyle={{
            minHeight: "100%",
            height: "100%",
            backgroundColor: "red",
          }}
        />
      </Reanimated.View>
    );
  }

  const invoiceItem = ({ item }: { item: IHoaDonDto_FullInfor }) => {
    return (
      <Swipeable
        friction={2}
        renderRightActions={RightAction}
        containerStyle={{ overflow: "hidden" }}
      >
        <RectButton style={styles.invoiceItem} onPress={gotoInvoiceDetails}>
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: 700 }}>
              {item?.tenKhachHang}
            </Text>
            <Text style={{ color: theme.colors.grey4 }}>{item?.maHoaDon}</Text>
            <Text style={{ color: theme.colors.grey4 }}>
              {dayjs(item?.ngayLapHoaDon).format("DD/MM/YYYY HH:mm")}
            </Text>
          </View>
          <View style={{ gap: 8, alignItems: "flex-end" }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: theme.colors.primary,
              }}
            >
              {CommonFunc.formatCurrency(item?.tongThanhToan ?? 0)}
            </Text>
            {(item?.conNo ?? 0) > 0 && (
              <View
                style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
              >
                <Text>Nợ:</Text>
                <Text
                  style={{
                    color: theme.colors.error,
                  }}
                >
                  {CommonFunc.formatCurrency(item?.conNo ?? 0)}
                </Text>
              </View>
            )}
          </View>
        </RectButton>
      </Swipeable>
    );
  };

  const toggleBoxFilter = () => {
    isShowBoxFilter.value = !isShowBoxFilter.value;
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ConfirmOKCancel
        isShow={objSimpleDialog?.isShow ?? false}
        mes={objSimpleDialog?.mes}
        onAgree={deleleInvoice}
        onClose={() =>
          setObjSimpleDialog({ ...objSimpleDialog, isShow: false })
        }
      />
      <View style={{ padding: 8 }}>
        {isShowBoxSearch ? (
          <SearchBar
            placeholder="Tìm kiếm hóa đơn"
            containerStyle={{
              borderTopWidth: 0,
              paddingVertical: 0,
              paddingHorizontal: 16,
              backgroundColor: theme.colors.white,
            }}
            inputContainerStyle={{
              backgroundColor: theme.colors.white,
            }}
            inputStyle={{ fontSize: 14 }}
            value={textSearch}
            onChangeText={(txt) => setTextSearch(txt)}
          />
        ) : (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ color: theme.colors.grey4, fontSize: 13 }}>
              Tổng số {pageDataHoaDon?.totalCount ?? 0} hóa đơn
            </Text>
            <View style={styles.boxFilter}>
              <Icon
                name="search"
                type={IconType.MATERIAL}
                onPress={() => setIsShowBoxSearch(true)}
              />
              <Icon
                name="filter"
                type={IconType.IONICON}
                onPress={toggleBoxFilter}
              />
            </View>
          </View>
        )}

        <FlatList
          data={pageDataHoaDon?.items}
          renderItem={invoiceItem}
          keyExtractor={(item) => item.id}
          onEndReachedThreshold={0.1}
          onEndReached={handleLoadMore}
        />
      </View>
      <BottomSheet isOpen={isShowBoxFilter} toggleSheet={toggleBoxFilter}>
        <View
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <Text style={{ fontWeight: 700, fontSize: 16 }}>Lọc hóa đơn</Text>
          <View style={{ marginTop: 16, gap: 16 }}>
            <View style={{ gap: 8 }}>
              <Text style={{ fontWeight: 600 }}>Thời gian</Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ gap: 8 }}>
                  <Text>Từ ngày</Text>
                  <DateTimePicker
                    value={new Date(paramSearchHoaDon?.fromDate ?? new Date())}
                    mode="date"
                    display="default"
                    onChange={(event: DateTimePickerEvent, date?: Date) =>
                      setParamSearchHoaDon({
                        ...paramSearchHoaDon,
                        fromDate: dayjs(date).format("YYYY-MM-DD"),
                      })
                    }
                    minimumDate={new Date(1950, 1, 1)}
                    timeZoneName="Asia/Ho_Chi_Minh"
                    locale="vi-VN"
                    is24Hour
                  />
                </View>
                <View style={{ gap: 8 }}>
                  <Text>Đến ngày</Text>
                  <DateTimePicker
                    value={new Date(paramSearchHoaDon?.toDate ?? new Date())}
                    mode="date"
                    display="default"
                    onChange={(event: DateTimePickerEvent, date?: Date) =>
                      setParamSearchHoaDon({
                        ...paramSearchHoaDon,
                        toDate: dayjs(date).format("YYYY-MM-DD"),
                      })
                    }
                    minimumDate={new Date(1950, 1, 1)}
                    timeZoneName="Asia/Ho_Chi_Minh"
                    locale="vi-VN"
                    is24Hour
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    boxFilter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 12,
      marginBottom: 12,
    },
    invoiceItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 8,
      borderBottomColor: theme.colors.grey5,
      borderBottomWidth: 1,
    },
    rightAction: { width: 50, height: 50, backgroundColor: "purple" },
  });
