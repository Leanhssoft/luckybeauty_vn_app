import BottomSheet from "@/components/_bottom_sheet";
import Radio from "@/components/_radio";
import { ConfirmOKCancel } from "@/components/confirm_ok_cancel";
import AppConst from "@/const/AppConst";
import { IconType } from "@/enum/IconType";
import { InvoiceStatus } from "@/enum/InvoiceStatus";
import { LoaiChungTu } from "@/enum/LoaiChungTu";
import { TrangThaiNo } from "@/enum/TrangThaiNo";
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
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList, RectButton } from "react-native-gesture-handler";
import Swipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";

import Reanimated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ServicePackage() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const { chiNhanhCurrent } = useAppContext();
  const idChiNhanhCurrent = chiNhanhCurrent?.id ?? "";
  const inputRef = useRef<TextInput | null>(null);
  const openRef = useRef<SwipeableMethods | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [textSearch, setTextSearch] = useState("");

  const isShowBoxFilter = useSharedValue(false);
  const [isShowBoxSearch, setIsShowBoxSearch] = useState(false);
  const [isShowDateFromPickker, setIsShowDateFromPickker] = useState(false);
  const [isShowDateToPickker, setIsShowDateToPickker] = useState(false);
  const [objSimpleDialog, setObjSimpleDialog] = useState<IPropsSimpleDialog>();
  const [invoiceItemChosed, setInvoiceItemChosed] = useState<IHoaDonDto>();
  const [paramSearchHoaDon, setParamSearchHoaDon] =
    useState<IParamSearchHoaDondto>({
      textSearch: "",
      idLoaiChungTus: [LoaiChungTu.GOI_DICH_VU],
      currentPage: currentPage,
      pageSize: AppConst.PAGE_SIZE,
      idChiNhanhs: [chiNhanhCurrent?.id ?? ""],
      fromDate: dayjs().startOf("month").format("YYYY-MM-DD"),
      toDate: dayjs().endOf("month").format("YYYY-MM-DD"),
      columnSort: "ngayLapHoaDon",
      typeSort: "desc",
      trangThais: [InvoiceStatus.HOAN_THANH],
      trangThaiNos: [TrangThaiNo.CON_NO, TrangThaiNo.HET_NO],
    });

  const lenTrangThaiNo = paramSearchHoaDon?.trangThaiNos?.length ?? 0;

  const [pageDataHoaDon, setPageDataHoaDon] = useState<
    IPageResultDto<IHoaDonDto>
  >({ items: [], totalCount: 0, totalPage: 0 });

  const GetListHoaDon = useCallback(async () => {
    const param: IParamSearchHoaDondto = {
      textSearch: textSearch,
      idLoaiChungTus: [LoaiChungTu.GOI_DICH_VU],
      currentPage: currentPage,
      pageSize: AppConst.PAGE_SIZE,
      idChiNhanhs: [idChiNhanhCurrent],
      fromDate: dayjs().startOf("month").format("YYYY-MM-DD"),
      toDate: dayjs().endOf("month").add(1, "day").format("YYYY-MM-DD"),
      columnSort: "ngayLapHoaDon",
      typeSort: "desc",
      trangThais: [InvoiceStatus.HOAN_THANH],
    };
    const data = await HoaDonService.GetListHoaDon(param);
    const dataNew = data?.items ?? [];

    if (currentPage === 1) {
      setPageDataHoaDon((prev) => {
        return {
          items: dataNew,
          totalCount: data?.totalCount ?? 0,
          totalPage: Math.ceil((data?.totalCount ?? 0) / AppConst.PAGE_SIZE),
        };
      });
    } else {
      setPageDataHoaDon((prev) => {
        return {
          items: [...(prev?.items ?? []), ...dataNew],
          totalCount: prev?.totalCount ?? 0,
          totalPage: Math.ceil((prev?.totalCount ?? 0) / AppConst.PAGE_SIZE),
        };
      });
    }
  }, [currentPage, idChiNhanhCurrent]);

  useEffect(() => {
    const getData = setTimeout(async () => {
      setCurrentPage(1);
    }, 2000);
    return () => clearTimeout(getData);
  }, [textSearch]);

  useEffect(() => {
    GetListHoaDon();
  }, [GetListHoaDon]);

  const handleLoadMore = () => {
    setCurrentPage(() => currentPage + 1);
  };

  const deleleInvoice = async () => {
    await HoaDonService.DeleteHoaDon(invoiceItemChosed?.id ?? "");
    setPageDataHoaDon({
      ...pageDataHoaDon,
      items: pageDataHoaDon?.items?.filter(
        (x) => x.id !== invoiceItemChosed?.id
      ),
      totalCount: (pageDataHoaDon?.totalCount ?? 0) - 1,
    });
    setObjSimpleDialog({
      ...objSimpleDialog,
      isShow: false,
    });
  };

  const showConfirmDelete = (item?: IHoaDonDto) => {
    setObjSimpleDialog({
      ...objSimpleDialog,
      isShow: true,
      mes: `Bạn có chắc chắn muốn xóa hóa đơn ${invoiceItemChosed?.maHoaDon} không?`,
    });
  };

  const gotoInvoiceDetails = () => {};

  function RightAction(
    progress: SharedValue<number>,
    drag: SharedValue<number>,
    item: IHoaDonDto
  ) {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value + 80 }],
      };
    }, []);

    return (
      <Reanimated.View style={styleAnimation}>
        <Button
          title="Xóa"
          onPress={() => {
            setInvoiceItemChosed(item);
            showConfirmDelete(item);
          }}
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

  const InvoiceItem = ({ item }: { item: IHoaDonDto_FullInfor }) => {
    const swipeableRef = useRef<SwipeableMethods | null>(null);

    return (
      <Swipeable
        friction={2}
        renderRightActions={(progress, drag) =>
          RightAction(progress, drag, item)
        }
        containerStyle={{ overflow: "hidden" }}
        onSwipeableOpen={() => {
          if (openRef.current && openRef.current !== swipeableRef?.current) {
            openRef.current.close();
          }
          openRef.current = swipeableRef.current;
        }}
        ref={swipeableRef}
        onSwipeableClose={() => {
          if (openRef.current === swipeableRef.current) {
            openRef.current = null;
          }
        }}
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

  const changeTrangThaiNo = (arr: number[]) => {
    setParamSearchHoaDon({ ...paramSearchHoaDon, trangThaiNos: arr });
  };

  const applyFilter = async () => {
    isShowBoxFilter.value = !isShowBoxFilter.value;
    const param: IParamSearchHoaDondto = {
      textSearch: "",
      idLoaiChungTus: [LoaiChungTu.GOI_DICH_VU],
      currentPage: 1,
      pageSize: AppConst.PAGE_SIZE,
      idChiNhanhs: [idChiNhanhCurrent],
      fromDate: dayjs(paramSearchHoaDon?.fromDate ?? new Date()).format(
        "YYYY-MM-DD"
      ),
      toDate: dayjs(paramSearchHoaDon?.toDate ?? new Date())
        .add(1, "day")
        .format("YYYY-MM-DD"),
      columnSort: "ngayLapHoaDon",
      typeSort: "desc",
      trangThais: [InvoiceStatus.HOAN_THANH],
      trangThaiNos: paramSearchHoaDon?.trangThaiNos ?? [],
    };
    console.log("param ", param);
    const data = await HoaDonService.GetListHoaDon(param);
    setPageDataHoaDon({
      items: data?.items,
      totalCount: data?.totalCount,
      totalPage: data?.totalPage,
    });
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
            platform={Platform.OS === "ios" ? "ios" : "android"}
            searchIcon={{ name: "search", type: IconType.IONICON }}
            clearIcon={{ name: "close", type: IconType.IONICON }}
            ref={inputRef}
            containerStyle={{
              backgroundColor: theme.colors.white,
              borderBottomColor: theme.colors.grey5,
              borderBottomWidth: 1,
              height: 44,
              margin: 0,
            }}
            inputContainerStyle={{
              height: 32,
              backgroundColor: theme.colors.white,
            }}
            value={textSearch}
            onChangeText={(txt) => setTextSearch(txt)}
            showCancel
            cancelButtonTitle="Huỷ"
            cancelButtonProps={{
              buttonTextStyle: { fontSize: 14 },
            }}
            onCancel={() => setIsShowBoxSearch(false)}
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
                onPress={() => {
                  setIsShowBoxSearch(true);
                  setTimeout(() => {
                    inputRef.current?.focus(); // focus into searchbox
                  }, 100);
                }}
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
          // renderItem={invoiceItem}
          renderItem={({ item }) => <InvoiceItem item={item} />}
          keyExtractor={(item) => item.id}
          onEndReachedThreshold={0.1}
          onEndReached={handleLoadMore}
        />
      </View>
      <BottomSheet isOpen={isShowBoxFilter} toggleSheet={toggleBoxFilter}>
        <View style={{ width: "100%", position: "relative" }}>
          <Icon
            name="close"
            type={IconType.IONICON}
            containerStyle={{ position: "absolute", top: -8, right: 0 }}
            onPress={toggleBoxFilter}
          />
          <Text style={{ fontWeight: 700, fontSize: 16 }}>Lọc hóa đơn</Text>
          <View style={{ marginTop: 24, gap: 16 }}>
            <View style={{ gap: 8 }}>
              <Text style={{ fontWeight: 600 }}>Thời gian</Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                {Platform.OS === "ios" ? (
                  <DateTimePicker
                    value={new Date(paramSearchHoaDon?.fromDate ?? new Date())}
                    mode="date"
                    display="default"
                    onChange={(event: DateTimePickerEvent, date?: Date) => {
                      setParamSearchHoaDon({
                        ...paramSearchHoaDon,
                        fromDate: dayjs(date).format("YYYY-MM-DD"),
                      });
                      setIsShowDateFromPickker(false);
                    }}
                    minimumDate={new Date(1950, 1, 1)}
                    timeZoneName="Asia/Ho_Chi_Minh"
                    locale="vi-VN"
                    style={{ backgroundColor: "#ffff" }}
                  />
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={() => setIsShowDateFromPickker(true)}
                    >
                      <Text
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          borderWidth: 1,
                          borderColor: theme.colors.grey5,
                        }}
                      >
                        {dayjs(
                          paramSearchHoaDon?.fromDate ?? new Date()
                        ).format("DD/MM/YYYY")}
                      </Text>
                    </TouchableOpacity>

                    {isShowDateFromPickker && (
                      <DateTimePicker
                        value={
                          new Date(paramSearchHoaDon?.fromDate ?? new Date())
                        }
                        mode="date"
                        display="default"
                        onChange={(event: DateTimePickerEvent, date?: Date) => {
                          setParamSearchHoaDon({
                            ...paramSearchHoaDon,
                            fromDate: dayjs(date).format("YYYY-MM-DD"),
                          });
                          setIsShowDateFromPickker(false);
                        }}
                        minimumDate={new Date(1950, 1, 1)}
                        timeZoneName="Asia/Ho_Chi_Minh"
                      />
                    )}
                  </>
                )}

                <Text> đến</Text>
                {Platform.OS === "ios" ? (
                  <DateTimePicker
                    value={new Date(paramSearchHoaDon?.toDate ?? new Date())}
                    mode="date"
                    display="default"
                    onChange={(event: DateTimePickerEvent, date?: Date) => {
                      setParamSearchHoaDon({
                        ...paramSearchHoaDon,
                        toDate: dayjs(date).format("YYYY-MM-DD"),
                      });
                      setIsShowDateFromPickker(false);
                    }}
                    minimumDate={new Date(1950, 1, 1)}
                    timeZoneName="Asia/Ho_Chi_Minh"
                    locale="vi-VN"
                    style={{ backgroundColor: "#ffff" }}
                  />
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={() => setIsShowDateToPickker(true)}
                    >
                      <Text
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          borderWidth: 1,
                          borderColor: theme.colors.grey5,
                        }}
                      >
                        {dayjs(paramSearchHoaDon?.toDate ?? new Date()).format(
                          "DD/MM/YYYY"
                        )}
                      </Text>
                    </TouchableOpacity>

                    {isShowDateToPickker && (
                      <DateTimePicker
                        value={
                          new Date(paramSearchHoaDon?.toDate ?? new Date())
                        }
                        mode="date"
                        display="default"
                        onChange={(event: DateTimePickerEvent, date?: Date) => {
                          setParamSearchHoaDon({
                            ...paramSearchHoaDon,
                            toDate: dayjs(date).format("YYYY-MM-DD"),
                          });
                          setIsShowDateFromPickker(false);
                        }}
                        minimumDate={new Date(1950, 1, 1)}
                        timeZoneName="Asia/Ho_Chi_Minh"
                      />
                    )}
                  </>
                )}
              </View>
            </View>
            <Text style={{ fontWeight: 600 }}>Trạng thái nợ</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 24,
                justifyContent: "center",
                marginLeft: 20,
              }}
            >
              <Radio
                isSelected={lenTrangThaiNo === 2}
                label="Tất cả"
                onPressRdo={() =>
                  changeTrangThaiNo([TrangThaiNo.CON_NO, TrangThaiNo.HET_NO])
                }
              />
              <Radio
                isSelected={
                  lenTrangThaiNo === 1 &&
                  (paramSearchHoaDon?.trangThaiNos?.filter(
                    (x) => x === TrangThaiNo.CON_NO
                  )?.length ?? 0) > 0
                }
                label="Còn nợ"
                onPressRdo={() => changeTrangThaiNo([TrangThaiNo.CON_NO])}
              />
              <Radio
                isSelected={
                  lenTrangThaiNo === 1 &&
                  (paramSearchHoaDon?.trangThaiNos?.filter(
                    (x) => x === TrangThaiNo.HET_NO
                  )?.length ?? 0) > 0
                }
                label="Hết nợ"
                onPressRdo={() => changeTrangThaiNo([TrangThaiNo.HET_NO])}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 8,
                marginTop: 16,
              }}
            >
              <Button
                title={"Hủy bỏ"}
                color={"error"}
                onPress={toggleBoxFilter}
              />
              <Button title={"Áp dụng"} onPress={applyFilter} />
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
