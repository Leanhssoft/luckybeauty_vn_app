import BottomButtonAdd from "@/components/_bottom_button_add";
import BottomSheet from "@/components/_bottom_sheet";
import Radio from "@/components/_radio";
import { ConfirmOKCancel } from "@/components/confirm_ok_cancel";
import ModalAddCustomer from "@/components/customer/modal_add_customer";
import { ListCustomerGroup } from "@/components/nhom_khach_hang/list_customer_group";
import ModalAddNhomKhachHang from "@/components/nhom_khach_hang/modal_add_nhom_khach_hang";
import AppConst from "@/const/AppConst";
import { ActionType } from "@/enum/ActionType";
import { IconType } from "@/enum/IconType";
import { LoaiDoiTuong } from "@/enum/LoaiDoiTuong";
import { TrangThaiHoatDong } from "@/enum/TrangThaiHoatDong";
import { TrangThaiNo } from "@/enum/TrangThaiNo";
import { IPagedRequestDto } from "@/services/commonDto/IPagedRequestDto";
import { IPageResultDto } from "@/services/commonDto/IPageResultDto";
import { ICreateOrEditKhachHangDto } from "@/services/customer/ICreateOrEditKhachHangDto";
import { IKhachHangItemDto } from "@/services/customer/IKhachHangItemDto";
import KhachHangService from "@/services/customer/KhachHangService";
import { IParamSearchCustomerDto } from "@/services/customer/ParamSearchCustomerDto";
import CustomerGroupService from "@/services/customer_group/CustomerGroupService";
import { ICustomerGroupDto } from "@/services/customer_group/ICustomerGroupDto";
import { useAppContext } from "@/store/react_context/AppProvider";
import { useKhachHangStore } from "@/store/zustand/khach_hang";
import { IPropsSimpleDialog } from "@/type/IPropsSimpleDialog";
import CommonFunc from "@/utils/CommonFunc";
import { Theme } from "@rneui/base";
import {
  Avatar,
  Button,
  CheckBox,
  Icon,
  ListItem,
  SearchBar,
  useTheme,
} from "@rneui/themed";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomerPage = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const { chiNhanhCurrent } = useAppContext();
  const firstLoad = useRef(true);
  const [isShowBoxSearch, setIsShowBoxSearch] = useState(false);
  const customerUpdate = useKhachHangStore((s) => s.customer);
  const [textSearch, setTextSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isShowModalAddCustomer, setIsShowModalAddCustomer] = useState(false);
  const [isShowModalAdd_CustomerGroup, setIsShowModalAdd_CustomerGroup] =
    useState(false);
  const [objSimpleDialog, setObjSimpleDialog] = useState<IPropsSimpleDialog>();
  const [customerChosed, setCustomerChosed] = useState<IKhachHangItemDto>();
  const [pageDataCustomer, setPageDataCustomer] = useState<
    IPageResultDto<IKhachHangItemDto>
  >({ items: [], totalCount: 0, totalPage: 0 });
  const [trangThaiNoSelected, setTrangThaiNoSelected] = useState([
    TrangThaiNo.CON_NO,
    TrangThaiNo.HET_NO,
  ]);
  const [idNhomKhachSelected, setIdNhomKhachSelected] = useState<string>("");

  const arrTrangThaiNo = [
    { id: TrangThaiNo.CON_NO, text: "Còn nợ" },
    { id: TrangThaiNo.HET_NO, text: "Hết nợ" },
  ];

  const [paramSearchCustomer, setParamSearchCustomer] =
    useState<IParamSearchCustomerDto>({
      idChiNhanhs: [chiNhanhCurrent?.id ?? ""],
      idNhomKhachs: [],
      loaiDoiTuong: LoaiDoiTuong.KHACH_HANG,
      currentPage: 1,
      pageSize: AppConst.PAGE_SIZE,
      trangThais: [TrangThaiHoatDong.DANG_HOAT_DONG],
    });

  const [pageDataNhomKhachHang, setPageDatNhomKhachHang] = useState<
    IPageResultDto<ICustomerGroupDto>
  >({ items: [], totalCount: 0, totalPage: 0 });

  const getAllNhomKhach = async () => {
    const input: IPagedRequestDto = {
      keyword: "",
      skipCount: 1,
      maxResultCount: 100,
    };
    const data = await CustomerGroupService.getAllNhomKhach(input);
    setPageDatNhomKhachHang({
      items: data?.items,
      totalCount: data?.totalCount,
      totalPage: Math.ceil(
        (data?.totalCount ?? 0) / (input?.maxResultCount ?? AppConst.PAGE_SIZE)
      ),
    });
  };

  const getListCustomer = async (param: IParamSearchCustomerDto) => {
    console.log("getListCustomer ", param.currentPage, param?.textSearch);

    if (isLoading) return; // tránh gọi nhiều lần
    setIsLoading(true);
    const data = await KhachHangService.getAll(param);

    if ((param?.currentPage ?? 0) === 1) {
      setPageDataCustomer({
        ...pageDataCustomer,
        items: data?.items,
        totalCount: data?.totalCount,
        totalPage: Math.ceil(
          (data?.totalCount ?? 0) /
            (paramSearchCustomer?.pageSize ?? AppConst.PAGE_SIZE)
        ),
      });
    } else {
      setPageDataCustomer((prev) => {
        return {
          ...prev,
          items: [
            ...prev.items,
            ...data?.items?.filter(
              (x) => !prev.items.some((y) => y.id === x.id)
            ),
          ],
          totalCount: prev?.totalCount,
        };
      });
    }
    setIsLoading(false);
  };

  const PageLoad = async () => {
    await getAllNhomKhach();
  };

  useEffect(() => {
    PageLoad();
  }, []);

  useEffect(() => {
    setPageDataCustomer((prev) => {
      return {
        ...prev,
        items: prev.items?.map((x) => {
          if (x.id === customerUpdate?.id) {
            return {
              ...x,
              maKhachHang: customerUpdate?.maKhachHang,
              tenKhachHang: customerUpdate?.tenKhachHang,
              soDienThoai: customerUpdate?.soDienThoai,
              diaChi: customerUpdate?.diaChi,
              ngaySinh: customerUpdate?.ngaySinh,
              idNhomKhach: customerUpdate?.idNhomKhach ?? "",
              tenNhomKhach: customerUpdate?.tenNhomKhach ?? "",
            };
          } else {
            return x;
          }
        }),
      };
    });
  }, [customerUpdate]);

  const isShowBoxFilter = useSharedValue(false);
  const inputRef = useRef<TextInput | null>(null);

  const toggleBoxFilter = () => {
    isShowBoxFilter.value = !isShowBoxFilter.value;
  };

  const onChangePage = async (newPage: number) => {
    setParamSearchCustomer((prev) => {
      return {
        ...prev,
        currentPage: newPage,
      };
    });
    const param = {
      ...paramSearchCustomer,
    };
    param.currentPage = newPage;
    await getListCustomer(param);
  };

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    const getData = setTimeout(async () => {
      const param = {
        ...paramSearchCustomer,
      };
      param.textSearch = textSearch;
      param.currentPage = 1;
      setParamSearchCustomer((prev) => {
        return {
          ...prev,
          currentPage: 1,
          textSearch: textSearch,
        };
      });
      console.log("textSearch ");

      await getListCustomer(param);
    }, 2000);
    return () => clearTimeout(getData);
  }, [textSearch]);

  const onClickDelete = (item: IKhachHangItemDto) => {
    setCustomerChosed({ ...item });
    setObjSimpleDialog({
      ...objSimpleDialog,
      isShow: true,
      mes: `Bạn có chắc chắn muốn xóa khách hàng ${item?.tenKhachHang} không`,
    });
  };
  const deleteCustomer = async () => {
    setObjSimpleDialog({ ...objSimpleDialog, isShow: false });
    await KhachHangService.delete(customerChosed?.id ?? "");
    setPageDataCustomer({
      ...pageDataCustomer,
      items: pageDataCustomer?.items?.filter(
        (x) => x.id !== customerChosed?.id
      ),
      totalCount: (pageDataCustomer?.totalCount ?? 0) - 1,
    });
  };

  const saveOKCustomer = (
    cusItem: ICreateOrEditKhachHangDto,
    actionid?: number
  ) => {
    setIsShowModalAddCustomer(false);

    switch (actionid) {
      case ActionType.INSERT:
        {
          setPageDataCustomer({
            ...pageDataCustomer,
            items: [cusItem, ...pageDataCustomer?.items],
            totalCount: (pageDataCustomer?.totalCount ?? 0) + 1,
          });
        }
        break;
      case ActionType.UPDATE:
        {
          setPageDataCustomer({
            ...pageDataCustomer,
            items: pageDataCustomer?.items?.map((x) => {
              if (x.id === cusItem?.id) {
                return {
                  ...x,
                  tenKhachHang: cusItem?.tenKhachHang,
                  tenNhomKhach: cusItem?.tenNhomKhach,
                  soDienThoai: cusItem?.soDienThoai,
                  idNhomKhach: cusItem?.idNhomKhach,
                  diaChi: cusItem?.diaChi,
                  ngaySinh: cusItem?.ngaySinh,
                  gioiTinhNam: cusItem?.gioiTinhNam,
                };
              } else {
                return { ...x };
              }
            }),
          });
        }
        break;
    }
  };

  const changeTrangThaiNo = (id: number) => {
    setTrangThaiNoSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return [id, ...prev];
    });
  };

  const choseNhomKhach = (item: ICustomerGroupDto) => {
    setIdNhomKhachSelected(item.id);
  };

  const saveOKCustomerGroup = (item: ICustomerGroupDto) => {
    setPageDatNhomKhachHang({
      ...pageDataNhomKhachHang,
      items: [item, ...pageDataNhomKhachHang?.items],
      totalCount: (pageDataNhomKhachHang?.totalCount ?? 0) + 1,
    });
  };

  const cancelFilter = () => {
    toggleBoxFilter();
    setIdNhomKhachSelected("");
    setTrangThaiNoSelected([TrangThaiNo.CON_NO, TrangThaiNo.HET_NO]);
    setParamSearchCustomer({
      ...paramSearchCustomer,
      trangThais: [TrangThaiHoatDong.DANG_HOAT_DONG],
    });
  };

  const applyFilter = async () => {
    isShowBoxFilter.value = !isShowBoxFilter.value;
    const param: IParamSearchCustomerDto = {
      textSearch: textSearch,
      idChiNhanhs: [chiNhanhCurrent?.id ?? ""],
      idNhomKhachs: [idNhomKhachSelected],
      loaiDoiTuong: LoaiDoiTuong.KHACH_HANG,
      currentPage: 1,
      pageSize: AppConst.PAGE_SIZE,
      trangThais: paramSearchCustomer?.trangThais ?? [],
    };
    const lenTrangThaiNo = trangThaiNoSelected?.length ?? 0;
    if (lenTrangThaiNo === 2 || lenTrangThaiNo === 0) {
      param.conNoFrom = null;
      param.conNoTo = null;
    } else {
      const ttNo = trangThaiNoSelected[0];
      if (ttNo === TrangThaiNo.CON_NO) {
        param.conNoFrom = 1;
        param.conNoTo = null;
      } else {
        param.conNoFrom = 0;
        param.conNoTo = 0;
      }
    }

    console.log("param ", param);
    const data = await KhachHangService.getAll(param);
    setPageDataCustomer({
      ...pageDataCustomer,
      items: data?.items,
      totalCount: data?.totalCount,
      totalPage: Math.ceil(
        (data?.totalCount ?? 0) /
          (paramSearchCustomer?.pageSize ?? AppConst.PAGE_SIZE)
      ),
    });
  };

  const loadMoreCustomer = () => {
    setParamSearchCustomer((prev) => {
      return {
        ...prev,
        currentPage: (prev?.currentPage ?? 1) + 1,
      };
    });
  };

  useEffect(() => {
    getListCustomer(paramSearchCustomer);
  }, [paramSearchCustomer?.currentPage]);

  const renderItem = ({
    item,
    index,
  }: {
    item: IKhachHangItemDto;
    index: number;
  }) => {
    return (
      <ListItem.Swipeable
        bottomDivider={false}
        containerStyle={{ paddingHorizontal: 4, paddingVertical: 8 }}
        rightContent={(reset) => (
          <Button
            title="Xóa"
            onPress={() => {
              onClickDelete(item);
              reset();
            }}
            icon={{ name: "delete", color: "white" }}
            buttonStyle={{ minHeight: "100%", backgroundColor: "red" }}
          />
        )}
      >
        <RectButton onPress={() => router.push(`/details/${item?.id}`)}>
          <ListItem.Content style={styles.customerItem}>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <Avatar
                rounded
                size={"medium"}
                title={CommonFunc.getFirstLetter(item?.tenKhachHang)}
                containerStyle={{
                  backgroundColor:
                    index % 4 === 1
                      ? theme.colors.softBlue_background
                      : index % 4 === 2
                      ? theme.colors.softOrange_background
                      : index % 4 === 3
                      ? theme.colors.softPink_background
                      : theme.colors.softTeal_background,
                }}
                titleStyle={{
                  fontSize: 18,
                  color:
                    index % 4 === 1
                      ? theme.colors.softBlue
                      : index % 4 === 2
                      ? theme.colors.softOrange
                      : index % 4 === 3
                      ? theme.colors.softPink
                      : theme.colors.softTeal,
                }}
              />
              <View style={{ gap: 4, alignItems: "center" }}>
                <Text style={{ fontSize: 20, fontWeight: 600 }}>
                  {item?.tenKhachHang}
                </Text>
                {item?.soDienThoai && (
                  <Text style={{ color: theme.colors.grey4 }}>
                    {item?.soDienThoai}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
            <View style={styles.boxNumber}>
              <View style={{ gap: 8 }}>
                <Text>{item?.tenNhomKhach ?? "Nhóm mặc định"}</Text>
                <Text>
                  Số dư thẻ:
                  <Text style={{ fontWeight: 600 }}>
                    {` ${CommonFunc.formatCurrency(item?.soDuTheGiaTri ?? 0)}`}
                  </Text>
                </Text>
              </View>
              <View style={{ gap: 8, alignItems: "center" }}>
                <Text> Còn nợ</Text>
                <Text
                  style={{
                    color:
                      (item?.conNo ?? 0) > 0
                        ? theme.colors.error
                        : theme.colors.black,
                  }}
                >
                  {CommonFunc.formatCurrency(item?.conNo ?? 0)}
                </Text>
              </View>
            </View>
          </ListItem.Content>
        </RectButton>
      </ListItem.Swipeable>
    );
  };

  return (
    <View style={[styles.container, { position: "relative" }]}>
      <ConfirmOKCancel
        isShow={objSimpleDialog?.isShow ?? false}
        mes={objSimpleDialog?.mes}
        onAgree={deleteCustomer}
        onClose={() =>
          setObjSimpleDialog({ ...objSimpleDialog, isShow: false })
        }
      />
      <ModalAddCustomer
        isShow={isShowModalAddCustomer}
        onClose={() => setIsShowModalAddCustomer(false)}
        onSave={saveOKCustomer}
      />
      <ModalAddNhomKhachHang
        isShow={isShowModalAdd_CustomerGroup}
        onClose={() => setIsShowModalAdd_CustomerGroup(false)}
        onSave={saveOKCustomerGroup}
      />
      <View style={{ paddingHorizontal: 8 }}>
        {isShowBoxSearch ? (
          <SearchBar
            placeholder="Tìm kiếm khách hàng"
            platform={Platform.OS === "ios" ? "ios" : "android"}
            searchIcon={{ name: "search", type: IconType.IONICON, size: 16 }}
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
              Tổng số {pageDataCustomer?.totalCount ?? 0} khách hàng
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
      </View>
      {/* <SearchBar
        placeholder="Tìm kiếm khách hàng"
        containerStyle={{
          backgroundColor: theme.colors.white,
        }}
        inputContainerStyle={{
          backgroundColor: theme.colors.white,
        }}
        value={textSearch}
        onChangeText={(txt) => setTextSearch(txt)}
      /> */}

      {isLoading && (
        <ActivityIndicator
          size={"large"}
          style={{
            position: "absolute",
            top: 100,
            width: "100%",
            zIndex: 99999,
          }}
        />
      )}
      <FlatList
        data={pageDataCustomer?.items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={{ paddingBottom: insets.bottom + 40 }}
        onEndReachedThreshold={0.1}
        onEndReached={loadMoreCustomer}
      />
      <BottomButtonAdd onPress={() => setIsShowModalAddCustomer(true)} />
      <BottomSheet isOpen={isShowBoxFilter} toggleSheet={toggleBoxFilter}>
        <View style={{ width: "100%" }}>
          <Icon
            name="close"
            type={IconType.IONICON}
            onPress={toggleBoxFilter}
            containerStyle={{
              position: "absolute",
              top: 0,
              right: 0,
              padding: 8,
            }}
          />
          <Text style={{ fontWeight: 700, fontSize: 16 }}>Lọc khách hàng</Text>
          <View style={{ marginTop: 24, gap: 16 }}>
            <View>
              <Text style={{ fontWeight: 600 }}>Nhóm khách</Text>
              <ListCustomerGroup
                selectedId={idNhomKhachSelected}
                choseItem={choseNhomKhach}
              />
            </View>

            <Text style={{ fontWeight: 600 }}>Trạng thái nợ</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 24,
                justifyContent: "center",
              }}
            >
              {arrTrangThaiNo?.map((x) => (
                <CheckBox
                  key={x.id}
                  checked={trangThaiNoSelected.includes(x.id)}
                  title={x.text}
                  onPress={() => changeTrangThaiNo(x.id)}
                  containerStyle={{ padding: 0, margin: 0 }}
                  textStyle={{ fontWeight: 400 }}
                />
              ))}
            </View>

            <Text style={{ fontWeight: 600 }}>Trạng thái khách hàng</Text>
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
                isSelected={
                  (paramSearchCustomer?.trangThais &&
                    (paramSearchCustomer?.trangThais?.length ?? 0) > 0 &&
                    paramSearchCustomer?.trangThais[0] ===
                      TrangThaiHoatDong.DANG_HOAT_DONG) ??
                  false
                }
                label={"Đang hoạt động"}
                onPressRdo={() =>
                  setParamSearchCustomer({
                    ...paramSearchCustomer,
                    trangThais: [TrangThaiHoatDong.DANG_HOAT_DONG],
                  })
                }
              />
              <Radio
                isSelected={
                  (paramSearchCustomer?.trangThais &&
                    (paramSearchCustomer?.trangThais?.length ?? 0) > 0 &&
                    paramSearchCustomer?.trangThais[0] ===
                      TrangThaiHoatDong.NGUNG_HOAT_DONG) ??
                  false
                }
                label={"Ngừng hoạt động"}
                onPressRdo={() =>
                  setParamSearchCustomer({
                    ...paramSearchCustomer,
                    trangThais: [TrangThaiHoatDong.NGUNG_HOAT_DONG],
                  })
                }
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
              <Button title={"Hủy bỏ"} color={"error"} onPress={cancelFilter} />
              <Button title={"Áp dụng"} onPress={applyFilter} />
            </View>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};
export default CustomerPage;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 8,
    },
    customerItem: {
      padding: 20,
      borderRadius: 8,
      backgroundColor: theme.colors.background,

      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 4,

      // Đổ bóng Android
      elevation: 3,
    },
    boxNumber: {
      justifyContent: "space-between",
      flexDirection: "row",
      marginTop: 16,
      width: "100%",
    },
    boxFilter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 12,
      marginBottom: 12,
    },
  });
